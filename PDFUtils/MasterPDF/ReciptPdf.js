const invoiceDetails = require('../../repositories/PaymentRepository/Customers/ViewInvoices');
const pdfMakePrinter = require('pdfmake');
/* var pdfMake = require('./pdfmake'); */
var fs = require('fs');
// var pdfFonts = require('./VFS_FONTS');
var path = require('path');
var appDir = path.dirname(require.main.filename);
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

exports.generateReceiptPdf = async (ReceiptNo, req, res) => {
    // let sessionObj = req.userData;
    console.log("generateReceiptPdf ReciptPdf. " + ReceiptNo)
    // let inputData = req.body;
    // if (inputData.InvoiceNo) {
    // let tet = inputData = req.query;
    // }
    // console.log(JSON.stringify(req.body))
    let resObj = {};
    // console.log("generateReceiptPdf Parameter \n" + JSON.stringify(req.body))
    // console.log("generateReceiptPdf 1 \n" + invoiceNo)
    let InvoiceDetailsList = await invoiceDetails.ReciptPdfInvoiceMasterdetailsByRecipitNo(ReceiptNo)
    console.log("InvoiceDetailsList-->>> \n " + JSON.stringify(InvoiceDetailsList));
    let singleInvoiceRecord = InvoiceDetailsList[0]

    resObj.streamData = await this.pdfgenerate(InvoiceDetailsList, singleInvoiceRecord, ReceiptNo); //console.log("asasa")
    resObj.docName = 'receiptDocument';
    resObj.InvoiceDetailsList = InvoiceDetailsList;

    return resObj;
}


exports.pdfgenerate = async (InvoiceDetailsList, singleInvoiceRecord, ReceiptNo) => {
    // let data = dataList[0];
    let subTotal = 0;
    let serviceTotalAmt = 0;
    let grandTotal = 0;

    let Reff;

    if (singleInvoiceRecord.Payment_mode === '2~bankwire' || singleInvoiceRecord.Payment_mode === '3~bankwire' || singleInvoiceRecord.Payment_mode === '4~bankwire') {
        Reff = 'FPX'
    } else if (singleInvoiceRecord.Payment_mode === '5~creditcard') {
        Reff = 'CCPAY'
    } else {
        Reff = singleInvoiceRecord.Payment_mode;
    }
    console.log(Reff)


    console.log("singleInvoiceRecord 1 2=> " + JSON.stringify(singleInvoiceRecord))
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
        { text: 'Invoice No', bold: true, alignment: 'center' },
        { text: 'Job Date ', bold: true, alignment: 'center' },

    ];

    tableValues.push(itemListHeader);
    let totalamount = 0.0;
    for (let index = 0; index < InvoiceDetailsList.length; index++) {
        const InvoiceReceiptPdf = InvoiceDetailsList[index];
        let columnWidth = 'width:auto';
        // console.log(index + " invoiceDtailss " + JSON.stringify(invoiceDtailss))
        // totalamount = Number(totalamount) + Number(InvoiceReceiptPdf.Total_amount_rm);
        totalamount = Number(totalamount) + Number(InvoiceReceiptPdf.Currency === 'MYR' ? InvoiceReceiptPdf.Sub_total_rm : InvoiceReceiptPdf.Sub_total);

        let records = [
            { text: InvoiceReceiptPdf.Costing_type == null ? '' : InvoiceReceiptPdf.Costing_type, alignment: 'center' },
            { text: InvoiceReceiptPdf.File_no, alignment: 'center' },
            { text: InvoiceReceiptPdf.Quotation_no, alignment: 'center' },
            { text: InvoiceReceiptPdf.Invoice_no, alignment: 'center' },
            { text: dateFormat(InvoiceReceiptPdf.Job_date === null ? '' : InvoiceReceiptPdf.Job_date, "dd/mm/yyyy"), alignment: 'center', style: 'tableHeader' },

        ];
        tableValues.push(records);
    }



    const line = { type: 'line', x1: 0, y1: 10, x2: 590, y2: 10, lineWidth: 1.0, lineColor: '#000000' };

    var docDefinition = {

        background: [

            {
                image: imageDir + '/wm.png',//imageDir + '/JomPay_Icon.PNG',
                width: 320, margin: [120, 210, 0, 20]
            },
        ],

        content: [

            {
                style: 'tableExample',
                margin: [-20, -75, 0, -50],
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
                    margin: [20, 20, 0, 0],
                    columns: [
                        {
                            image: imageDir + '/Sirim_Invoice_Icon.jpg',
                            width: 50
                        }, {
                            width: 7,
                            text: ''
                        },
                        { text: 'SIRIM QAS International Sdn Bhd \n Company No. 410334-X\n No.1 Persiaran Dato  Menteri, Section 2, P.O.Box 7035\n 40700 Shah Alam Selangor \nTel : 603-55446836 Fax : 603-55445672\n Toll Free :1-300-88-7035 www.sirim-qas.com.my \n Services Tax ID: B16-1809-32001048', fontSize: 9 }
                    ]
                },


                // {
                //     alignment: 'justify',
                //     margin: [20, 10, 0, 0],
                //     columns: [
                //         {
                //             image: imageDir + '/Sirim_Invoice_Icon.jpg',
                //             width: 110
                //         }, {
                //             width: 20,
                //             text: ''
                //         },


                //         { text: 'SIRIM QAS International Sdn Bhd \n Company No. 410334-X\n No.1 Persiaran Dato  Menteri, Section 2, P.O.Box 7035\n 40700 Shah Alam Selangor \nTel : 603-55446836 Fax : 603-55445672\n Toll Free :1-300-88-7035 www.sirim-qas.com.my \n Services Tax ID: B16-1809-32001048', fontSize: 9 }

                //     ]
                // },

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
                                    [{ text: 'ID No.', bold: true }, ':', { text: singleInvoiceRecord.Customer_id }],
                                    [{ text: 'Name', bold: true }, ':', { text: singleInvoiceRecord.Company_name == null || singleInvoiceRecord.Company_name == 'null' ? '' : singleInvoiceRecord.Company_name }],
                                    [{ text: 'Address ', bold: true }, ':', { text: singleInvoiceRecord.Manufacturer_address1 == null ? '' : singleInvoiceRecord.Manufacturer_address1 }],
                                    [{ text: '', bold: true }, '', { text: (singleInvoiceRecord.Manufacturer_address2 == null || singleInvoiceRecord.Manufacturer_address2 == 'null' ? '' : singleInvoiceRecord.Manufacturer_address2) + (singleInvoiceRecord.Manufacturer_address3 == null || singleInvoiceRecord.Manufacturer_address3 == 'null' ? '' : singleInvoiceRecord.Manufacturer_address3) }],
                                    // [{ text: '', bold: true }, ':', { text: singleInvoiceRecord.Manufacturer_address3 }],
                                    [{ text: '', bold: true }, '', { text: (singleInvoiceRecord.CityName == null || singleInvoiceRecord.CityName == 'N/A' || singleInvoiceRecord.CityName == 'null') ? '' : singleInvoiceRecord.CityName + " " + (singleInvoiceRecord.StateName == null || singleInvoiceRecord.StateName == 'N/A' || singleInvoiceRecord.StateName == 'null') ? '' : singleInvoiceRecord.StateName + " " + (singleInvoiceRecord.CountryName == null || singleInvoiceRecord.CountryName == 'N/A' || singleInvoiceRecord.CountryName == 'null') ? '' : singleInvoiceRecord.CountryName }],
                                    // [{ text: '', bold: true }, ':', { text: 'REGION RUSSIAN FEDERATION' }],
                                    [{ text: 'Payment Type ', bold: true }, ':', { text: singleInvoiceRecord.Payment_type == null ? '' : singleInvoiceRecord.Payment_type }],
                                    // [{ text: 'Payment Mode ', bold: true }, ':', { text: singleInvoiceRecord.Payment_mode }],
                                    [{ text: 'Ref No.   ', bold: true }, ':', { text: Reff === null ? '' : Reff }],
                                    [{ text: 'Amount (' + singleInvoiceRecord.Currency + ')', bold: true }, ':', { text: totalamount.toFixed(2) }],
                                    [{ text: 'Description' + " " + " " + ':', bold: true, fontSize: 8, margin: [0, 70, 50, 0], }, '', { text: singleInvoiceRecord.Description == null ? '' : singleInvoiceRecord.Description, margin: [-60, 70, 50, 0] }],
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

                                    [{ text: 'Receipt No.  ', bold: true }, ':', { text: singleInvoiceRecord.Receipt_no == null ? '' : singleInvoiceRecord.Receipt_no }],
                                    [{ text: 'Date Issue ', bold: true }, ':', { text: newDate }],

                                ]
                            },
                            layout: 'noBorders'
                        },



                    ]
                },

            ]
        },

        footer: function (currentPage, pageCount) {

            return [{ text: 'THIS IS A COMPUTER GENERATED DOCUMENT. NO SIGNATURE IS REQUIRED. RECEIPT IS CONSIDERED VALID UPON PAYMENT CLEARED BY BANK.', alignment: 'center', margin: [20, 220, 20, 5] },
            { text: '\nPage ' + currentPage + ' of ' + pageCount, alignment: 'center' },
            ]
        },




    }

    var pdfDoc = printer.createPdfKitDocument(docDefinition);

    // pdfDoc.pipe(fs.createWriteStream('/home/software1/Desktop/final.pdf'));
    // let ReceiptNo = singleInvoiceRecord.Receipt_no;
    // var fileName = ReceiptNo + "_" + dateFormat(new Date(), "ddmmyyyyHHmmss") + '.pdf';
    var fileName = dateFormat(new Date(), "ddmmyyyyHHmmss") + '.pdf';
    // var filepath = __dirname + + fileName
    var pdffilepath = appDir + '/ReceiptPDF/' + fileName
    pdfDoc.pipe(fs.createWriteStream(pdffilepath));
    pdfDoc.filepath = pdffilepath;
    pdfDoc.fileName = fileName;

    // // pdfDoc.pipe(blobStream());
    // pdfDoc.end();
    console.log("fileName " + fileName)

    console.log("path " + appDir)

    console.log("END filepath " + pdfDoc.filepath)

    // var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(blobStream());
    pdfDoc.end();

    return pdfDoc;

}

