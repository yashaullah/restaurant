/**
 * Yumzee — Content sync (Categories, Food Items, Team, News, Gallery, Deals)
 * Separate Google Sheet + separate Apps Script deployment from the Orders one.
 *
 * SETUP
 * 1) Go to https://sheets.google.com → create a new blank spreadsheet
 *    (name it "Yumzee Content").
 * 2) Extensions → Apps Script. Delete the default code, paste this whole file.
 * 3) Run → setup (top menu). Approve permissions when asked.
 *    This creates "Categories", "Items", "Team", "News", "Gallery" and
 *    "Deals" tabs with header rows, plus a Drive folder named "Yumzee
 *    Images" for uploaded photos.
 * 4) Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Deploy → copy the Web App URL.
 * 5) Paste that URL into assets/js/config.js → CONTENT_WEBAPP_URL
 *    (this is a DIFFERENT url from SHEETS_WEBAPP_URL, which stays for orders).
 */

const CAT_SHEET = 'Categories';
const ITEM_SHEET = 'Items';
const TEAM_SHEET = 'Team';
const NEWS_SHEET = 'News';
const GALLERY_SHEET = 'Gallery';
const DEALS_SHEET = 'Deals';
const DRIVE_FOLDER_NAME = 'Yumzee Images';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let catSh = ss.getSheetByName(CAT_SHEET);
  if (!catSh) catSh = ss.insertSheet(CAT_SHEET);
  if (catSh.getLastRow() === 0) {
    catSh.appendRow(['name']);
    catSh.setFrozenRows(1);
  }

  let itemSh = ss.getSheetByName(ITEM_SHEET);
  if (!itemSh) itemSh = ss.insertSheet(ITEM_SHEET);
  if (itemSh.getLastRow() === 0) {
    itemSh.appendRow(['id','name','category','price','slogan','description','img','tag','variants']);
    itemSh.setFrozenRows(1);
  }

  let teamSh = ss.getSheetByName(TEAM_SHEET);
  if (!teamSh) teamSh = ss.insertSheet(TEAM_SHEET);
  if (teamSh.getLastRow() === 0) {
    teamSh.appendRow(['id','name','role','bio','img']);
    teamSh.setFrozenRows(1);
  }

  let newsSh = ss.getSheetByName(NEWS_SHEET);
  if (!newsSh) newsSh = ss.insertSheet(NEWS_SHEET);
  if (newsSh.getLastRow() === 0) {
    newsSh.appendRow(['id','text']);
    newsSh.setFrozenRows(1);
  }

  let gallerySh = ss.getSheetByName(GALLERY_SHEET);
  if (!gallerySh) gallerySh = ss.insertSheet(GALLERY_SHEET);
  if (gallerySh.getLastRow() === 0) {
    gallerySh.appendRow(['id','img','caption']);
    gallerySh.setFrozenRows(1);
  }

  let dealsSh = ss.getSheetByName(DEALS_SHEET);
  if (!dealsSh) dealsSh = ss.insertSheet(DEALS_SHEET);
  if (dealsSh.getLastRow() === 0) {
    dealsSh.appendRow(['id','type','label','price','desc','highlight']);
    dealsSh.setFrozenRows(1);
  }

  getOrCreateDriveFolder();
  return { catSh, itemSh, teamSh, newsSh, gallerySh, dealsSh };
}

function getOrCreateDriveFolder() {
  const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

function sheetToObjects(sh) {
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1)
    .filter(row => row.some(cell => cell !== '' && cell !== null))
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = setup(); // safe to call every time — only creates what's missing

  const out = {
    categories: sheetToObjects(sh.catSh).map(c => c.name).filter(Boolean),
    items: sheetToObjects(sh.itemSh),
    team: sheetToObjects(sh.teamSh),
    news: sheetToObjects(sh.newsSh),
    gallery: sheetToObjects(sh.gallerySh),
    deals: sheetToObjects(sh.dealsSh).map(d => ({ ...d, highlight: d.highlight === true || d.highlight === 'TRUE' || d.highlight === 'true' })),
  };
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === 'uploadImage') {
      const url = uploadImage(data.filename, data.mimeType, data.base64);
      return jsonOut({ ok: true, url: url });
    }

    if (action === 'addCategory') {
      const sh = ss.getSheetByName(CAT_SHEET) || setup().catSh;
      const existing = sheetToObjects(sh).map(c => c.name);
      if (existing.indexOf(data.name) === -1) sh.appendRow([data.name]);
      return jsonOut({ ok: true });
    }

    if (action === 'removeCategory') {
      removeRowWhere(ss.getSheetByName(CAT_SHEET), 'name', data.name);
      // also remove items in that category
      const itemSh = ss.getSheetByName(ITEM_SHEET);
      const rows = itemSh.getDataRange().getValues();
      const headers = rows[0];
      const catCol = headers.indexOf('category');
      for (let i = rows.length - 1; i >= 1; i--) {
        if (rows[i][catCol] === data.name) itemSh.deleteRow(i + 1);
      }
      return jsonOut({ ok: true });
    }

    if (action === 'addItem') {
      const sh = ss.getSheetByName(ITEM_SHEET) || setup().itemSh;
      const item = data.item;
      item.id = item.id || ('x' + Date.now());
      sh.appendRow([item.id, item.name, item.category, item.price, item.slogan || '', item.description || '', item.img || '', item.tag || '', item.variants ? JSON.stringify(item.variants) : '']);
      return jsonOut({ ok: true, id: item.id });
    }

    if (action === 'removeItem') {
      removeRowWhere(ss.getSheetByName(ITEM_SHEET), 'id', data.id);
      return jsonOut({ ok: true });
    }

    if (action === 'updateItem') {
      const patch = Object.assign({}, data.patch);
      if ('variants' in patch) patch.variants = patch.variants ? JSON.stringify(patch.variants) : '';
      updateRowWhere(ss.getSheetByName(ITEM_SHEET), 'id', data.id, patch);
      return jsonOut({ ok: true });
    }

    if (action === 'addTeamMember') {
      const sh = ss.getSheetByName(TEAM_SHEET) || setup().teamSh;
      const m = data.member;
      m.id = m.id || ('m' + Date.now());
      sh.appendRow([m.id, m.name, m.role, m.bio || '', m.img || '']);
      return jsonOut({ ok: true, id: m.id });
    }
    if (action === 'updateTeamMember') {
      updateRowWhere(ss.getSheetByName(TEAM_SHEET), 'id', data.id, data.patch);
      return jsonOut({ ok: true });
    }
    if (action === 'removeTeamMember') {
      removeRowWhere(ss.getSheetByName(TEAM_SHEET), 'id', data.id);
      return jsonOut({ ok: true });
    }

    if (action === 'addNews') {
      const sh = ss.getSheetByName(NEWS_SHEET) || setup().newsSh;
      const n = data.item;
      n.id = n.id || ('news' + Date.now());
      sh.appendRow([n.id, n.text]);
      return jsonOut({ ok: true, id: n.id });
    }
    if (action === 'updateNews') {
      updateRowWhere(ss.getSheetByName(NEWS_SHEET), 'id', data.id, data.patch);
      return jsonOut({ ok: true });
    }
    if (action === 'removeNews') {
      removeRowWhere(ss.getSheetByName(NEWS_SHEET), 'id', data.id);
      return jsonOut({ ok: true });
    }

    if (action === 'addGalleryImage') {
      const sh = ss.getSheetByName(GALLERY_SHEET) || setup().gallerySh;
      const g = data.item;
      g.id = g.id || ('g' + Date.now());
      sh.appendRow([g.id, g.img || '', g.caption || '']);
      return jsonOut({ ok: true, id: g.id });
    }
    if (action === 'updateGalleryImage') {
      updateRowWhere(ss.getSheetByName(GALLERY_SHEET), 'id', data.id, data.patch);
      return jsonOut({ ok: true });
    }
    if (action === 'removeGalleryImage') {
      removeRowWhere(ss.getSheetByName(GALLERY_SHEET), 'id', data.id);
      return jsonOut({ ok: true });
    }

    if (action === 'addDeal') {
      const sh = ss.getSheetByName(DEALS_SHEET) || setup().dealsSh;
      const d = data.deal;
      d.id = d.id || ('dl' + Date.now());
      sh.appendRow([d.id, d.type || 'bigg', d.label || '', d.price || '', d.desc || '', d.highlight ? 'TRUE' : 'FALSE']);
      return jsonOut({ ok: true, id: d.id });
    }
    if (action === 'updateDeal') {
      const patch = Object.assign({}, data.patch);
      if ('highlight' in patch) patch.highlight = patch.highlight ? 'TRUE' : 'FALSE';
      updateRowWhere(ss.getSheetByName(DEALS_SHEET), 'id', data.id, patch);
      return jsonOut({ ok: true });
    }
    if (action === 'removeDeal') {
      removeRowWhere(ss.getSheetByName(DEALS_SHEET), 'id', data.id);
      return jsonOut({ ok: true });
    }

    return jsonOut({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function uploadImage(filename, mimeType, base64) {
  const folder = getOrCreateDriveFolder();
  const bytes = Utilities.base64Decode(base64);
  const blob = Utilities.newBlob(bytes, mimeType, filename);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  // Direct-viewable image URL (works in <img src>)
  return 'https://lh3.googleusercontent.com/d/' + file.getId();
}

function removeRowWhere(sh, colName, value) {
  const values = sh.getDataRange().getValues();
  const headers = values[0];
  const col = headers.indexOf(colName);
  for (let i = values.length - 1; i >= 1; i--) {
    if (values[i][col] === value) sh.deleteRow(i + 1);
  }
}

function updateRowWhere(sh, colName, value, patch) {
  const values = sh.getDataRange().getValues();
  const headers = values[0];
  const col = headers.indexOf(colName);
  for (let i = 1; i < values.length; i++) {
    if (values[i][col] === value) {
      Object.keys(patch).forEach(key => {
        const pCol = headers.indexOf(key);
        if (pCol !== -1) sh.getRange(i + 1, pCol + 1).setValue(patch[key]);
      });
      return;
    }
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
