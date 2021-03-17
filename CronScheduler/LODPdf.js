var logger = require('../logger');
let invoiceDetails = require('../repositories/PaymentRepository/Customers/ViewInvoices');
var badDebtRepository = require('../CronScheduler/BadDebtRepository');
var path = require('path');
var blobStream = require('blob-stream');
var moment = require('moment');
var dateFormat = require('dateformat');
var fontDir = path.join(__dirname + '/fonts1/verdana');
// SIRIM_SERVER\CronScheduler\fonts1\verdana
var imageDir = path.join(__dirname + '/images');

let filename = "test";
// Stripping special characters
filename = encodeURIComponent(filename) + '.pdf'

let newDate = dateFormat(new Date(), 'dd-mm-yyyy ');
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





// exports.GenerateLODPdfdetails = async () => {

//     let resObj = {};

//     try {

//         let Details = await invoiceDetails.InvoiceMasterdetails();

//         console.log("Details" + JSON.stringify(Details));

//         resObj = await this.GenerateLODPdf(Details);
//         return resObj;

//     } catch (error) {

//     }

// }













exports.GenerateLODPdf = async (Details) => {

    console.log("pdfgenerate-3->");
    var datetime = new Date();
    let currentDate = (dateFormat(datetime, "dd-mm-yyyy"));
    console.log("--" + currentDate);
    let invoice_date = (dateFormat(Details[0].Invoice_date, "dd-mm-yyyy"));
    console.log("invoice_date-->" + invoice_date);
    let D_status;
    let NoOfDays = (currentDate - invoice_date);
    console.log("NoOfDays-->" + JSON.stringify(NoOfDays));

    let DebtStatus = Details[0].Bad_debt_status;

    console.log("DebtStatus-->" + JSON.stringify(DebtStatus));

    switch (DebtStatus) {

        case 0:
            D_status = ''

            break;
        case 1:
            D_status = 'Credit Term'

            break;
        case 2:
            D_status = 'Reminder 1'

            break;
        case 3:
            D_status = 'Reminder 2'

            break;
        case 4:
            D_status = 'Bad Debt'

            break;
        case 5:
            D_status = 'LOD'

            break;
        case 6:
            D_status = 'Yes'

            break;
        case 7:
            D_status = 'Yes'

            break;
        case 8:
            D_status = 'Yes'

            break;
        case 9:
            D_status = 'Yes'

            break;
        case 10:
            D_status = 'Yes'

            break;
        default:
            break;
    }

    console.log("Debt_S==" + JSON.stringify(D_status))


    // let data = dataList[0];

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
    let itemListHeader = [
        { text: 'No.', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'File No', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Company Name', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Product', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Invoice No', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Invoice Date', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Currency', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Invoice Amount', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'No of Days', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Debt Status', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Payment Status', style: 'tableHeader', bold: true, alignment: 'left' }
    ];

    temp.push(itemListHeader);
    for (let index = 0; index < Details.length; index++) {
        const LodDetails = Details[index];
        logger.info("\n\nPDFINCLUDE\n" + JSON.stringify(LodDetails))
        let columnWidth = 'width:auto';
        // grandTotal = grandTotal + Number(InvoiceMAster.Sub_total_rm);
        // subTotal = subTotal + Number(InvoiceMAster.Total_amount_rm);
        console.log("dateofvisit" + JSON.stringify())
        var dateofvisit = moment(new Date(LodDetails.Invoice_date), 'MM/DD/YYYY');
        console.log("" + JSON.stringify())
        var today = moment(new Date(), 'MM/DD/YYYY');
        var day = today.diff(dateofvisit, 'days');
        console.log("" + JSON.stringify())

        let records = [
            { text: index + 1, alignment: 'left' },
            { text: LodDetails.File_no, alignment: 'left' },
            { text: LodDetails.Company_name, alignment: 'left' },
            { text: LodDetails.Product, alignment: 'left' },
            { text: LodDetails.Invoice_no, alignment: 'left' },
            { text: dateFormat(LodDetails.Invoice_date, "dd-mm-yyyy"), alignment: 'left' },
            { text: LodDetails.Currency, alignment: 'left' },
            { text: LodDetails.Total_amount, alignment: 'left' },
            // { text: 'No days', alignment: 'left' },
            { text: day, alignment: 'left' },
            { text: D_status, alignment: 'left' },
            { text: 'UNPAID', alignment: 'left' },
        ];
        temp.push(records);
    }


    const line = { type: 'line', x1: 0, y1: 10, x2: 100, y2: 10, lineWidth: 1.0, lineColor: '#000000' };

    var docDefinition = {



        content: [

            {
                style: 'tableExample',
                margin: [-28, -235, 10, 0],
                table: {
                    widths: [16, 30, 50, 40, 44, 49, 25, 36, 25, 40, 62],
                    body: temp


                }, layout: 'headerLineOnly', fillColor: '#D9E3FF',
            },

            // {
            //     columns: [

            //         {
            //             style: 'tableExample',
            //             margin: [10, 20, 0, 0],
            //             table: {
            //                 widths: ['auto'],
            //                 body: [
            //                     [{ text: 'D' }]
            //                 ]
            //             }, layout: 'noBorders'
            //         },
            //         {
            //             style: 'tableExample',
            //             margin: [117, 20, 0, 0],
            //             table: {

            //                 widths: ['auto'],
            //                 body: [
            //                     [{ text: 'Approved By', bold: true }],
            //                 ]
            //             }, layout: 'noBorders'
            //         }
            //     ],
            // },





        ], defaultStyle: {
            font: 'Verdana',
            fontSize: 8
        },



        pageMargins: [40, 460, 40, 220],
        header: function (currentPage, pageCount) {
            return [
                {
                    alignment: 'justify',
                    margin: [20, 10, 0, 0],
                    columns: [
                        {
                            image: imageDir + '/Sirim_Invoice_Icon.jpg',
                            width: 58
                        }, {
                            width: 7,
                            text: ''
                        },
                        { text: 'SIRIM QAS International Sdn Bhd \n Company No. 410334-X\n No.1 Persiaran Dato  Menteri, Section 2, P.O.Box 7035\n 40700 Shah Alam Selangor \nTel : 603-55446836 Fax : 603-55445672\n Toll Free :1-300-88-7035 www.sirim-qas.com.my \n Services Tax ID: B16-1809-32001048', fontSize: 9 }
                    ]
                },
                {
                    columns: [
                        {


                            style: 'tableExample',
                            margin: [20, 30, 0, 0],
                            table: {
                                // widths: ['auto'],
                                body: [

                                    [{ text: 'LIST OF DEBT COLLECTOR', alignment: 'left', bold: true, fontSize: 14 }]

                                ]
                            }, layout: 'noBorders'
                        },
                        {


                            style: 'tableExample',
                            margin: [175, 33, 0, 0],
                            table: {
                                // widths: ['auto'],
                                body: [

                                    [{ text: ' Date', alignment: 'left', bold: true }, ':', { text: currentDate }]

                                ]
                            }, layout: 'noBorders'
                        }



                    ],
                },
                // {
                //     margin: [10, 15, -30, 65],
                //     columns: [
                //         {
                //             style: 'tableExample',
                //             margin: [10, 15, -10, 0],
                //             table: {
                //                 widths: ['auto', 'auto', 'auto'],
                //                 body: [
                //                     [{ text: 'ID No.', bold: true }, ':', { text: singleInvoiceData.Customer_id, bold: true }],
                //                     [{ text: 'Name', bold: true }, ':', { text: singleInvoiceData.Company_name, bold: true }],
                //                     [{ text: 'Address ', bold: true }, ':', { text: singleInvoiceData.Manufacturer_address1, bold: true }],
                //                     [{ text: '', bold: true }, ':', { text: singleInvoiceData.Manufacturer_address2, bold: true }],
                //                     [{ text: '', bold: true }, ':', { text: cityName == null ? '' : cityName + " " + stateName + " " + countryName + " " + singleInvoiceData.Postcode, bold: true }],
                //                     [{ text: 'Attention ', bold: true }, ':', { text: singleInvoiceData.Customer_name, bold: true }],
                //                 ]
                //             },
                //             layout: 'noBorders'
                //         },
                //         {
                //             margin: [70, 15, -50, 0],
                //             style: 'tableExample',
                //             table: {
                //                 widths: ['auto', 'auto', 'auto'],
                //                 body: [
                //                     [{ text: 'Date ', bold: true }, ':', { text: newDate, bold: true }],
                //                     [{ text: 'Your PO No ', bold: true }, ':', { text: singleInvoiceData.Po_no === null ? '' : singleInvoiceData.Po_no, bold: true }],
                //                     [{ text: 'Batch No ', bold: true }, ':', { text: singleInvoiceData.Batch_No === null ? '' : singleInvoiceData.Batch_No, bold: true }],
                //                     [{ text: 'Tel No ', bold: true }, ':', { text: PdfContactss.OfficeNo === null ? '' : PdfContactss.OfficeNo, bold: true }],
                //                     [{ text: 'Completion Date ', bold: true }, ':', { text: dateFormat(singleInvoiceData.Completion_date, "dd-mm-yyyy"), bold: true }],
                //                 ]
                //             },
                //             layout: 'noBorders'
                //         },
                //     ]
                // },
            ]
        },

        footer: function (currentPage, pageCount) {
            return [
                // {
                //     text: [
                //         { text: '\nCREDIT TERM IS STRICTLY 30 DAYS ', bold: true, }, '\nCheque to be made payable to', { text: ' SIRIM QAS INTERNATIONAL SDN BHD', bold: true }, { text: ' \n Payment can alsoi be made into RHB account number 2-12451-4008606-7/Swift code RHBBMYKL. Please send the bank-in-slip/payment advice by e-mail to finqas@sirim.my or fax to 603-55445672 as  proof of payment. Receipt based on request only.' },
                //     ],
                //     margin: [20, 50, 20, 0]
                // },
                // { text: 'THIS IS A COMPUTER GENERATED DOCUMENT. NO SIGNATURE IS REQUIRED', alignment: 'center', margin: [20, 40, 0, 0] },
                { text: '\nPage ' + currentPage + ' of ' + pageCount, alignment: 'center', margin: [10, 100, 0, 0] },
            ]
            currentPage.toString() + ' of ' + pageCount;
        },
    }

    // var pdfDoc = printer.createPdfKitDocument(docDefinition);
    // var filepath = __dirname + + filename
    // pdfDoc.pipe(fs.createWriteStream(__dirname + '/final.pdf'));
    // pdfDoc.filepath = filepath;
    // pdfDoc.end();

    try {
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        // pdfDoc.pipe(blobStream());
        var fileName = dateFormat(new Date(), "dd_mmmm_yyyy_HH_mm_ss") + '.pdf';
        var filePath = __dirname + '\\PDF_File\\' + fileName;
        pdfDoc.pipe(fs.createWriteStream(filePath));
        // pdfDoc.pipe(fs.createWriteStream(__dirname + '/finalszz.pdf'));
        pdfDoc.fileName = fileName;
        pdfDoc.filePath = filePath;
        pdfDoc.end();
    } catch (error) {
        console.log("File error : " + error)
    }

    logger.info("eqe ")
    return pdfDoc;
}