const invoiceDetails = require('../../repositories/PaymentRepository/Customers/ViewInvoices');
const pdfMakePrinter = require('pdfmake');
/* var pdfMake = require('./pdfmake'); */
var fs = require('fs');
// var pdfFonts = require('./VFS_FONTS');
var path = require('path');
var blobStream = require('blob-stream');
var moment = require('moment');
var dateFormat = require('dateformat');
var fontDir = path.join(__dirname + '/fonts1/verdana');
var imageDir = path.join(__dirname + '/images');



let filename = "test";
// Stripping special characters
filename = encodeURIComponent(filename) + '.pdf'
let newDate = dateFormat(new Date(), 'dd/mm/yyyy ');

// Define font files
var fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};


var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');



var docDefinition = {
    // ...
};

var options = {
    // ...
}

exports.generateReceiptPdf = async (req, res) => {
    // let sessionObj = req.userData;    
    let inputData = req.body;
    let resObj = {};
    let InvoiceDetailsList = await invoiceDetails.InvoiceMasterdetails(inputData.Invoiceno)
    let singleInvoiceRecord = InvoiceDetailsList[0]

    resObj.streamData = await this.pdfgenerate(InvoiceDetailsList, singleInvoiceRecord);    //console.log("asasa")    
    resObj.docName = 'Receipt';
    return resObj;
}


try {

} catch (error) {

}



exports.pdfgenerate = async (InvoiceDetailsList, singleInvoiceRecord) => {
    // let data = dataList[0];
    let subTotal = 0;
    let serviceTotalAmt = 0;
    let grandTotal = 0;

    console.log("singleInvoiceRecord 1=> " + JSON.stringify(singleInvoiceRecord))
    var fonts = {
        Courier: {
            normal: 'Courier',
            bold: 'Courier-Bold',
            italics: 'Courier-Oblique',
            bolditalics: 'Courier-BoldOblique'
        },
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        },
        Times: {
            normal: 'Times-Roman',
            bold: 'Times-Bold',
            italics: 'Times-Italic',
            bolditalics: 'Times-BoldItalic'
        },
        Symbol: {
            normal: 'Symbol'
        },
        ZapfDingbats: {
            normal: 'ZapfDingbats'
        },
        Verdana: {
            normal: fontDir + '/verdana.ttf',
            bold: fontDir + '/Verdana Bold.ttf'

        }
    };

    var PdfPrinter = require('pdfmake');
    var printer = new PdfPrinter(fonts);
    var fs = require('fs');


    var temp = [];


    let itemListHeaders = [{ text: '\nCosting Type  ', style: 'tableHeader', bold: true, alignment: 'center' }, { text: '\nFile No', style: 'tableHeader', bold: true, alignment: 'center' }, { text: '\nQuotation No', style: 'tableHeader', bold: true, alignment: 'center' }, { text: '\nInvoice No ', style: 'tableHeader', bold: true, alignment: 'center' }, { text: '\nJob Date', style: 'tableHeader', bold: true, alignment: 'center' }];

    temp.push(itemListHeaders);

    let shipTos = [{ text: '', fontSize: 8, bold: true, colSpan: 6 }]
    temp.push(shipTos);


    let columnWidth = 'width:auto';



    let records = [{ text: 'New Application ', alignment: 'center' }, { text: ' P5-014009', alignment: 'center' }, { text: 'Q0003246 ', alignment: 'center' }, { text: 'P152X1945801', alignment: 'center' }, { text: '22/7/2019 – 27/7/2019', alignment: 'center' }];

    temp.push(records);
    let remarkss = [{ text: "", colSpan: 6, bold: true }];

    temp.push(remarkss);

    let remarks = [{ text: " ", colSpan: 6, bold: true }];

    temp.push(remarks);

    var tableValues = [];
    let itemListHeader = [
        { text: 'Costing Type', bold: true, alignment: 'center' },
        { text: 'File No', bold: true, alignment: 'center' },
        { text: 'Quotation No', bold: true, alignment: 'center' },
        { text: ' Invoice No ', bold: true, alignment: 'center' },
        { text: 'Job Date ', bold: true, alignment: 'center' },

    ];

    tableValues.push(itemListHeader);
    for (let index = 0; index < InvoiceDetailsList.length; index++) {
        const InvoiceReceiptPdf = InvoiceDetailsList[index];
        let columnWidth = 'width:auto';
        // console.log(index + " invoiceDtailss " + JSON.stringify(invoiceDtailss))

        let records = [
            { text: InvoiceReceiptPdf.Costing_type, alignment: 'center' },
            { text: InvoiceReceiptPdf.File_no, alignment: 'center' },
            { text: InvoiceReceiptPdf.Quotation_no, alignment: 'center' },
            { text: InvoiceReceiptPdf.File_no, alignment: 'center' },
            { text: dateFormat(InvoiceReceiptPdf.job_date, "dd/mm/yyyy"), alignment: 'center', style: 'tableHeader' },

        ];
        tableValues.push(records);
    }



    const line = { type: 'line', x1: 0, y1: 10, x2: 590, y2: 10, lineWidth: 1.0, lineColor: '#000000' };

    var docDefinition = {

        background: [

            {
                image: imageDir + '/watermark.png',
                width: 200, margin: [175, 220, 0, 20]
            }
        ],

        content: [

            {
                style: 'tableExample',
                // margin: [60, -25, 0, -50],
                table: {

                    // width: 'auto',
                    widths: ['*', '*', '*', '*', '*'],
                    body:

                        tableValues,
                }


            },




        ], defaultStyle: {
            font: 'Verdana',
            fontSize: 8
        },





        //pageMargins: [40, 460, 30, 50],
        pageMargins: [40, 460, 40, 290],

        header: function (currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element

            return [
                {
                    alignment: 'justify',
                    margin: [20, 10, 0, 0],
                    columns: [
                        {
                            image: imageDir + '/Sirim_Invoice_Icon.JPG',
                            width: 110
                        }, {
                            width: 20,
                            text: ''
                        },


                        { text: ' \n\n SIRIM QAS International Sdn Bhd \n Company No. 410334-X SIRIM Complex\n No.1 Persiaran Dato  Menteri, Section 2, P.O.Box 7035, \n 40700 Shah Alam Selangor Tel : 603-55446836 \n Fax : 603-55445672 ', fontSize: 10 }

                    ]
                },

                { text: '\nOFFICIAL RECEIPT', alignment: 'center', bold: true, fontSize: 20 },
                {
                    margin: [10, 15, -30, 65],
                    columns: [
                        {
                            style: 'tableExample',
                            margin: [10, 15, -10, 0],
                            table: {
                                widths: ['auto', 'auto', 'auto'],
                                body: [
                                    [{ text: 'ID No.', bold: true }, ':', { text: singleInvoiceRecord.id_no }],
                                    [{ text: 'Name', bold: true }, ':', { text: singleInvoiceRecord.Customer_name }],
                                    [{ text: 'Address ', bold: true }, ':', { text: singleInvoiceRecord.Manufacturer_address1 }],
                                    [{ text: '', bold: true }, ':', { text: singleInvoiceRecord.Manufacturer_address2 }],
                                    [{ text: '', bold: true }, ':', { text: singleInvoiceRecord.Manufacturer_address3 }],
                                    // [{ text: '', bold: true }, ':', { text: 'REGION RUSSIAN FEDERATION' }],
                                    [{ text: 'Payment Type ', bold: true }, ':', { text: singleInvoiceRecord.payment_mode }],
                                    [{ text: 'Ref No.   ', bold: true }, ':', { text: singleInvoiceRecord.Reference_no }],
                                    [{ text: 'Amount (' + singleInvoiceRecord.currency + ')', bold: true }, ':', { text: singleInvoiceRecord.Sub_total_rm }]
                                ]
                            },
                            layout: 'noBorders'
                        },

                        {
                            style: 'tableExample',
                            margin: [80, 15, -50, 0],
                            table: {
                                widths: ['auto', 'auto', 'auto'],
                                body: [

                                    [{ text: 'Receipt No.  ', bold: true }, ':', { text: singleInvoiceRecord.receipt_no }],
                                    [{ text: 'Date Issue ', bold: true }, ':', { text: newDate }],

                                ]
                            },
                            layout: 'noBorders'
                        },



                    ]
                },
                { text: 'Description', bold: true, fontSize: 8, margin: [20, 15, 50, 0] },
            ]
        },

        footer: function (currentPage, pageCount) {

            return [{ text: 'THIS IS A COMPUTER GENERATED DOCUMENT. NO SIGNATURE IS REQUIRED. RECEIPT IS CONSIDERED VALID UPON PAYMENT CLEARED BY BANK.', alignment: 'center', margin: [20, 220, 20, 5] },
            { text: '\nPage ' + currentPage + ' of ' + pageCount, alignment: 'center' },
            ]
        },




    }

    // var pdfDoc = printer.createPdfKitDocument(docDefinition);
    // // var filepath = __dirname + '\\PDF_FILE\\'
    // // pdfDoc.pipe(fs.createWriteStream('/home/software1/Desktop/final.pdf'));
    // let fileNames = singleInvoiceRecord.invoice_no;
    // var fileName = dateFormat(new Date(), "dd_mmmm_yyyy_HH_mm_ss") + '.pdf';
    // // var filepath = __dirname + + fileName
    // pdfDoc.pipe(fs.createWriteStream(__dirname +'/'+ fileName));
    // // pdfDoc.filepath = filepath;
    // // pdfDoc.pipe(blobStream());
    // pdfDoc.end();

    // console.log("END PADF " + pdfDoc.filepath)

    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(blobStream());
    pdfDoc.end();

    return pdfDoc;

}









