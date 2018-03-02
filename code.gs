function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function uploadFileToDrive(base64Data, fileName) {
  try{
    var splitBase = base64Data.split(','),
        type = splitBase[0].split(';')[0].replace('data:','');

    var byteCharacters = Utilities.base64Decode(splitBase[1]);
    var ss = Utilities.newBlob(byteCharacters, type);
    ss.setName(fileName);

    var dropbox = "Electronic Reserve Files"; // Folder Name
    var folder, folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
       
    var file = folder.createFile(ss);

    return file.getName();
    
  }catch(e){
    return 'Error: ' + e.toString();
  }
}

function uploadDataToDrive(Instructor, Email, Department, Course, Start_Date, End_Date, Comments) {
    // record data in spreadsheet
    var docKey = [doc key];
    var doc = SpreadsheetApp.openById(docKey);
    var sheet = doc.getSheetByName([sheet name]);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    var nextRow = sheet.getLastRow() + 1

    var submitDate = new Date();
    var dateDay = submitDate.getDate();
    var dateMonth = submitDate.getMonth() + 1;
    var dateYear = submitDate.getFullYear();
    var timeHour = submitDate.getHours();
    var timeMin = submitDate.getMinutes();
    var timeSec = submitDate.getSeconds();
    
    var Timestamp = dateMonth + '-' + dateDay + '-' + dateYear + ' ' + timeHour + ':' + timeMin + ':' + timeSec;
    var newRow = [Timestamp, Instructor, Email, Department, Course, Start_Date, End_Date, Comments];
  
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])
   
    // send notification email
    var emailSubject = "Electronic Reserve Request Submission";  
    var yourEmail = [email];
    var message = "Submitted: " + Timestamp + "\n\n";
    message += "Instructor: " + Instructor + "\n\n";
    message += "Email: " + Email + "\n\n";
    message += "Department: " + Department + "\n\n";
    message += "Course: " + Course + "\n\n";
    message += "Course Start Date: " + Start_Date + "\n\n";
    message += "Course End Date: " + End_Date + "\n\n";
    message += "Additional Comments: " + Comments + "\n\n";
    message += "File Uploads Folder: [folder url]" + "\n\n";
    GmailApp.sendEmail(yourEmail, emailSubject, message); 
}
