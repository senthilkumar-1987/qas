const fs = require('fs')
let jsonData = {}
const jsonFilePath = __dirname+'/Pdf-Json-Format.json';
fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
  if (err) throw err
  jsonData = JSON.parse(data);
})

async function generateHeader(doc) {
  //console.log('--> ' + JSON.stringify(jsonData));
  let sirimIcon = __dirname+'/images/Sirim_Invoice_Icon.jpg';
  doc
    .image(sirimIcon, 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(10)
    .text(jsonData.InvoicePdf.companyName, 110, 50)
    .text(jsonData.InvoicePdf.line1, 110, 60)
    .text(jsonData.InvoicePdf.line2, 110, 70)
    .text(jsonData.InvoicePdf.line3, 110, 80)
    .text(jsonData.InvoicePdf.line4, 110, 90)
    .text(jsonData.InvoicePdf.line5, 110, 100)
    .text(jsonData.InvoicePdf.line6, 110, 110)
    .moveDown();

  //   doc.text(jsonData.InvoicePdf.companyName, 110, 57).moveDown();
  //   doc.text(jsonData.InvoicePdf.line1, 110, 57).moveDown();
  //   doc.text(jsonData.InvoicePdf.line2, 110, 57).moveDown();
  //   .text(jsonData.InvoicePdf.line1, 110, 57)
  /* .text(jsonData.InvoicePdf.line2, 110, 57)
  .text(jsonData.InvoicePdf.line3, 110, 57)
  .text(jsonData.InvoicePdf.line4, 110, 57)
  .text(jsonData.InvoicePdf.line5, 110, 57)
  .text(jsonData.InvoicePdf.line6, 110, 57) */

}

async function generateFooter(doc,footerPosition) {
  doc
    .fontSize(10)
    .text(
      "THIS IS A COMPUTER GENERATED DOCUMENT. NO SIGNATURE IS REQUIRED.",
      50,
      730,
      { align: "center", width: 500 }
    );
}

async function generateCustomerInformation(doc, invoice) {
 
  // let jomPayIcon = __dirname + '/JomPay_Icon.jpg';
  console.log("--> "+JSON.stringify(invoice));

  doc.font('Helvetica-Bold').fillColor("#444444")
    .fontSize(20)
    .text('INVOICE', 50, 130,{ align: 'center'});
    // await generateHr(doc, 150);

    doc.fontSize(8)
    .text('ID No : '+invoice.IDNo, 80, 160)
    .text('Name : '+invoice.Name, 80, 180)
    .text('Invoice No : '+invoice.InvoiceNo, 250,180,{align: "right",width:220})
    .text('Address : '+invoice.AddressLine1, 80, 200)
    .text('Date : '+invoice.Date, 250,200,{align: "right",width:220})
    .text('Your PONo : '+invoice.YourPONo, 250,220,{align: "right" ,width:220})
    .text('File No : '+invoice.FileNo, 250,240,{align: "right" ,width:220})
    .text('Tel No : '+invoice.TelNo, 250,260,{align: "right" ,width:220})
    .text('Completion Date : '+invoice.CompletionDate, 250,280,{align: "right",width:220 })
    .text(invoice.AddressLine2, 110, 220)
    .text(invoice.AddressLine3, 110, 240)
    .text(invoice.City, 110, 260)
    .text('Attention : '+invoice.Attention, 80, 280)
    // .text("JomPAY online at Internet and Mobile Banking with your Current, Savings or Credit Card account", 200, 160, { align: "right"});
   
    // .text("123 Main Street", 200, 175, { align: "right" })
    // .text("New York, NY, 10025", 200, 195, { align: "right" });

  // await generateHr(doc, 185);

  /* const shipping = invoice.shipping;

  doc
    .text(`ID No: ${invoice.invoice_nr}`, 50, 200)
    .text(`Invoice Date: ${new Date()}`, 50, 215)
    .text(`Balance Due: ${invoice.subtotal - invoice.paid}`, 50, 130)

    .text(shipping.name, 300, 200)
    .text(shipping.address, 300, 215)
    .text(
      `${shipping.city}, ${shipping.state}, ${shipping.country}`,
      300,
      130
    )
    .moveDown(); */
}
async function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

async function generateInvoiceTable(doc, invoice) {

  
  let i;
  const invoiceTableTop = 300;

  doc.font("Helvetica-Bold");
 await generateTableRow(
    doc,
    invoiceTableTop,
    "SNo.",
    "Description",
    "Job Date",
    "Expiry Date",
    "Total RM"
  );
  await generateHr(doc, invoiceTableTop + 10);
  doc.font("Helvetica");

   for (i = 0; i < invoice.itemList.length; i++) {
    const item = invoice.itemList[i];
    const position = invoiceTableTop + (i + 1) * 35;
    await generateTableRow(
      doc,
      position,
      item.SNo,
      item.Description,
      item.JobDate,
      item.ExpiryDate,
      item.Total
    );
  //  await generateHr(doc, position + 20);
  }
  const subtotalPosition = invoiceTableTop + (i + 1) * 33;

  /* console.log('invoiceTableTop-->'+invoiceTableTop+" "+i);
 
  await generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Total Sales",
    "",
    ""
  ); */

  await generateTotalSalesDetails(doc,subtotalPosition,'Total Sales : ',invoice.TotalSales);
  
 const lessAdvancePaidPosition = subtotalPosition + 25;

  await generateTotalSalesDetails(doc,lessAdvancePaidPosition,'Less:Advance paid : ',invoice.LessAdvancePaid);

  const netSalesAfterAdvancePosition = lessAdvancePaidPosition + 25;

  await generateTotalSalesDetails(doc,netSalesAfterAdvancePosition,'Net Sales after Advance : ',invoice.LessAdvancePaid);

  const addServiceTaxPositon= netSalesAfterAdvancePosition+ 25;

  await generateTotalSalesDetails(doc,addServiceTaxPositon,'Add Service Tax 6% : ',invoice.AddServiceTax);

  const roundingAdjustmentPosition= addServiceTaxPositon+25;

  await generateTotalSalesDetails(doc,roundingAdjustmentPosition,'Rounding Adjustment : ',invoice.RoundingAdjustment);

  const totalAmountPayablePosition= roundingAdjustmentPosition+ 25;

  await generateTotalSalesDetails(doc,totalAmountPayablePosition,'Total Amount Payable : ',invoice.TotalAmountPayable);


  const preparedByPosition=totalAmountPayablePosition+20;
  const approvedByPosition=totalAmountPayablePosition+20;
  doc.fontSize(8)
  .text('Prepared by : \n '+invoice.PreparedBy, 80, preparedByPosition)
  .text('Approved by : \n '+invoice.ApprovedBy, 180, approvedByPosition,{align: "right",width:310});

  const termsPosition=preparedByPosition+30;
  doc.fontSize(8)
  .text(invoice.terms, 80, termsPosition,{align: "center",width:410});
 
  const footerPosition=termsPosition+30;
  await generateFooter(doc,footerPosition);

  /* doc.fontSize(10)
    .text(+invoice.TotalSales, 230, subtotalPosition,{align: "right",width:310}); */

 /* const paidToDatePosition = subtotalPosition + 20;
  await generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(invoice.paid) 
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
 await  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  doc.font("Helvetica");*/
}

 function generateTableRow(
  doc,
  y,
  sNo,
  description,
  jobDate,
  expiryDate,
  total
) {
  doc
    .fontSize(10)
    .text(sNo, 50, y,{ width:20,align: 'left'})
    .text(description, 80, y,{ width:180,align: 'left'})
    .text(jobDate, 280, y, { width: 90, align: "right" })
    .text(expiryDate, 370, y, { width: 130, align: "right" })
    .text(total, 0, y, { align: "right" });
}

function generateTotalSalesDetails(
  doc,
  y,
  textContent,
  textValue
) {
  doc
    .fontSize(10)
    .text(textContent, 280, y, { width: 150, align: "right" })
    .text(textValue, 0, y, {align: "right" })
}



module.exports = {
  generateHeader,
  generateFooter,
  generateCustomerInformation,
  generateInvoiceTable
}