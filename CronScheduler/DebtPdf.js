var logger = require('../logger');
let invoiceDetails = require('../repositories/PaymentRepository/Customers/ViewInvoices');

var path = require('path');
var blobStream = require('blob-stream');
var moment = require('moment');
var dateFormat = require('dateformat');
var fontDir = path.join(__dirname + '/fonts1/verdana');
// SIRIM_SERVER\CronScheduler\fonts1\verdana
var imageDir = path.join(__dirname + '/images');

// let filename = "test";
// Stripping special characters
// filename = encodeURIComponent(filename) + '.pdf'

let newDate = dateFormat(new Date(), 'dd-mm-yyyy ');
let Year = dateFormat(new Date(), 'yyyy ');
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
const { fontSize } = require('pdfkit');




exports.GetLOD3Details = async (req, res) => {

    let resObj = {};

    try {

        let Details = await invoiceDetails.LodDetailsRepo();

        let debtData = await invoiceDetails.BadDebtDate();

        // let PdfContacts = await invoiceDetails.PDFContacts('', Details.Invoiceno);
        let address = await invoiceDetails.Address(Details);
        console.log("---cc-" + JSON.stringify(address));
        console.log("Details" + JSON.stringify(Details));
        console.log("debtData" + JSON.stringify(debtData));
        console.log("----" + JSON.stringify(address));
        // console.log("PdfContacts" + JSON.stringify(PdfContacts));
        console.log("address" + JSON.stringify(address));

        resObj = await this.pdfgenerate(Details, debtData, address);
        return resObj;

    } catch (error) {

    }

}




exports.pdfgenerate = async (Details) => {

    console.log("pdfgenerate-LODD->" + JSON.stringify(Details));
    let address = await invoiceDetails.Address(Details);

    // let LODDETAILS = Details[0];
    // let data = dataList[0];


    let Amount = 0;
    let AmountPaid = 0;
    let OutAmount = 0;
    let grandTotal = 0;
    let cityName = '';
    let stateName = '';
    let countryName = '';
    let INVCurrency = Details[0].Currency;
    if (address.length != 0) {
        console.log("address-SET-" + JSON.stringify(address))
        let addressDetails = address;
        cityName = addressDetails.City[0].CityName;
        console.log("C \n " + JSON.stringify(cityName));
        stateName = addressDetails.State[0].StateName;
        console.log("stateName \n " + JSON.stringify(stateName));
        countryName = addressDetails.Country[0].CountryName
    }

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
        { text: 'Invoice No', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Date of Invoice', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'File No', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'First Reminder Issued', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Second Reminder Issued', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Amount (' + INVCurrency + ')', style: 'tableHeader', bold: true, alignment: 'center' },
        { text: 'Amount Paid (' + INVCurrency + ')', style: 'tableHeader', bold: true, alignment: 'center' },
        { text: 'Outstanding Amount (' + INVCurrency + ')', style: 'tableHeader', bold: true, alignment: 'center' },
    ];

    temp.push(itemListHeader);
    for (let index = 0; index < Details.length; index++) {
        const InvoiceMAster = Details[index];

        let FirstRemainderDate = await invoiceDetails.RemainderDate(InvoiceMAster.Invoice_no, 2, 'Reminder 1');
        let SecendRemainderDate = await invoiceDetails.RemainderDate(InvoiceMAster.Invoice_no, 3, 'Reminder 2');

        logger.info("\n\nPDFINCLUDE\n" + JSON.stringify(InvoiceMAster))
        let columnWidth = 'width:auto';
        // grandTotal = grandTotal + Number(InvoiceMAster.Sub_total_rm);
        // subTotal = subTotal + Number(InvoiceMAster.Total_amount_rm);
        console.log("currency")
        Amount = InvoiceMAster.Sub_total_rm;
        AmountPaid = InvoiceMAster.Advance_paid_amount;
        OutAmount = (Amount - Number(AmountPaid));
        grandTotal = (grandTotal + Number(OutAmount));
        let currency = InvoiceMAster.Currency;
        console.log("currency--4" + JSON.stringify(InvoiceMAster.Currency));
        let records = [
            { text: index + 1, alignment: 'left' },
            { text: InvoiceMAster.Invoice_no, alignment: 'left' },
            { text: dateFormat(InvoiceMAster.Invoice_date, "dd-mm-yyyy"), alignment: 'left' },
            { text: InvoiceMAster.File_no, alignment: 'left' },
            //{ text: dateFormat(FirstRemainderDate[0].Created_date, "dd-mm-yyyy"), alignment: 'left' },
            // { text: dateFormat(SecendRemainderDate[0].Created_date, "dd-mm-yyyy"), alignment: 'left' },
            { text: (FirstRemainderDate != null) ? dateFormat(FirstRemainderDate[0].Created_date, "dd-mm-yyyy") : '', alignment: 'left' },
            { text: (SecendRemainderDate != null) ? dateFormat(SecendRemainderDate[0].Created_date, "dd-mm-yyyy") : '', alignment: 'left' },
            { text: Amount.toFixed(2), alignment: 'center' },
            { text: AmountPaid.toFixed(2), alignment: 'center' },
            { text: OutAmount.toFixed(2), alignment: 'center' },
        ];
        temp.push(records);

    }
    // console.log("currency" + InvoiceMAster[0].Currency);


    let Total = [
        { text: '', colSpan: 7 }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: 'Total(' + INVCurrency + ')', alignment: 'center' }, { text: grandTotal.toFixed(2), alignment: 'center' }
    ];
    temp.push(Total);


    // const line = { type: 'line', x1: 0, y1: 10, x2: 100, y2: 10, lineWidth: 1.0, lineColor: '#000000' };

    var docDefinition = {



        content: [
            { text: 'The details of the outstanding amount are as follows:-', margin: [-20, 0, 0, 0] },

            {
                style: 'tableExample',
                margin: [-20, 20, -17, 0],
                table: {
                    widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: temp


                },
            },
            // { text: 'Total', margin: [310, 5, 0, 0] },

            {
                columns: [
                    {
                        margin: [-20, 10, -13, 0],
                        style: 'tableExample',
                        table: {
                            body: [

                                [{ text: 'Kindly make payment for the outstanding amount of (' + INVCurrency + " " + grandTotal.toFixed(2) + ') within fourteen (14) days from the date of this letter, failing which, we shall proceed with the next course of action (suspension leading to revocation including legal action) without any further notice\n to you, in which event, all costs and expenses incurred thereof shall be borne by you.' }]
                            ]
                        }, layout: 'noBorders'
                    },
                ],
            },

            {
                columns: [
                    {
                        margin: [-20, -1, -13, 0],
                        style: 'tableExample',
                        table: {
                            body: [

                                [{ text: 'If payment has already been made, please accept our thanks and kindly disregard this letter. However, we wish to seek your kind assistance to furnish proof of payment to us by post or fax to +603-55446810 (Legal & Corporate Affairs). Alternatively, you may do so by completing the attached Proof of Payment form and return to us by fax or post.' }]
                            ]
                        }, layout: 'noBorders'
                    },
                ],
            },
            {
                columns: [
                    {
                        margin: [-20, -1, -13, 0],
                        style: 'tableExample',
                        table: {
                            body: [

                                [{ text: 'If you have any queries about your account, kindly contact En. Muhammad Fakrulrazi Bin Mohamed (+603- 55445644) or Pn. Azizun Ayub (+603-55445684) from Finance Section during office hours (Monday - Thursday: 8.00 a.m - 5.00 p.m and Friday : 8.00 a.m - 4.45 p.m)' }]
                            ]
                        }, layout: 'noBorders'
                    },
                ],
            },

            {
                columns: [
                    {
                        margin: [-20, 10, 0, 0],
                        style: 'tableExample',
                        table: {
                            body: [

                                [{ text: 'Thank you.' }],
                                [{ text: 'Yours faithfully,' }],
                                [{ text: 'AIN NADHIRA BINTI JAHAYA ', bold: true }],
                                [{ text: 'Counsel' }],
                                [{ text: 'Legal & Corporate Affair' }],
                                [{ text: 'Managing Director' + 's' + 'Office' }],
                                [{ text: 'SIRIM QAS International Sdn Bhd' }],
                            ]
                        }, layout: 'noBorders'
                    },
                ],
            },

        ], defaultStyle: {
            font: 'Verdana',
            fontSize: 8
        },



        pageMargins: [40, 270, 40, 220],
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
                        { text: 'SIRIM QAS International Sdn Bhd \n Company No. 410334-X\n No.1 Persiaran Dato  Menteri, Section 2, P.O.Box 7035\n 40700 Shah Alam Selangor \nTel : 603-55446836 Fax : 603-55445672\n Toll Free :1-300-88-7035 www.sirim-qas.com.my \n Services Tax ID: B16-1809-32001048', fontSize: 8 }
                    ]
                },
                {
                    columns: [
                        {


                            style: 'tableExample',
                            margin: [20, 10, 0, 0],
                            table: {
                                widths: ['auto', 'auto', 'auto'],
                                body: [

                                    [{ text: 'Our Ref', alignment: 'left', bold: true }, ':', { text: 'LCA/LOD/' + Year + ' ' }],
                                    [{ text: 'Date', alignment: 'left', bold: true }, ':', { text: newDate }]

                                ]
                            }, layout: 'noBorders'
                        },
                        {


                            style: 'tableExample',
                            margin: [175, 13, 0, 0],
                            table: {
                                // widths: ['auto'],
                                body: [

                                    [{ text: '(LETTER OF DEMAND)', alignment: 'left', bold: true }]

                                ]
                            }, layout: 'noBorders'
                        }



                    ],
                },

                {
                    // margin: [10, -5, -30, 0],
                    columns: [
                        {
                            style: 'tableExample',
                            margin: [20, 10, -10, 0],
                            table: {
                                widths: ['auto'],
                                body: [

                                    [{ text: Details[0].Company_name, bold: true }],
                                    [{ text: Details[0].Manufacturer_address1 }],
                                    [{ text: Details[0].Manufacturer_address2 == null ? Details[0].Manufacturer_address2 : '' }],
                                    [{ text: Details[0].Manufacturer_address3 }],
                                    [{ text: cityName == null ? '' : cityName + " " + stateName + " " + countryName + " " + (Details[0].Postcode === null ? Details[0].Postcode : '') }]
                                    //  [{ text: '', bold: true }, ':', { text: 'REGION RUSSIAN FEDERATION', bold: true }],
                                ]
                            },
                            layout: 'noBorders'
                        },

                        {
                            margin: [175, 12, -50, 0],
                            style: 'tableExample',
                            table: {
                                widths: ['auto'],
                                body: [
                                    [{ text: 'By Registered Post', bold: true }],
                                ]
                            },
                            layout: 'noBorders'
                        },

                    ]
                },

                {
                    columns: [
                        {
                            margin: [20, 5, -10, 0],
                            style: 'tableExample',
                            table: {
                                body: [

                                    [{ text: 'Attention' }, ':', { text: Details[0].Customer_name }]
                                ]
                            }, layout: 'noBorders'
                        },
                    ],
                },
                {
                    columns: [
                        {
                            margin: [20, 3, -10, 0],
                            style: 'tableExample',
                            table: {
                                body: [

                                    [{ text: 'Dear Sir/Madam,' }]
                                ]
                            }, layout: 'noBorders'
                        },
                    ],
                },
                {
                    columns: [
                        {
                            margin: [20, 3, -10, 0],
                            style: 'tableExample',
                            table: {
                                body: [

                                    [{ text: 'OUTSTANDING PAYMENT DUE TO SIRIM QAS INTERNATIONAL SDN. BHD.', bold: true, fontSize: 8 }]
                                ]
                            }, layout: 'noBorders'
                        },
                    ],
                },
                {
                    columns: [
                        {
                            margin: [20, 0, -10, 0],
                            style: 'tableExample',
                            table: {
                                body: [

                                    [{ text: 'We write to inform you that our record shows there is an outstanding amount of (' + INVCurrency + " " + grandTotal.toFixed(2) + ') due to us for the services duly provided \n to you upon your request.\n' }]
                                ]
                            }, layout: 'noBorders'
                        },
                    ],
                },
                // {
                //     columns: [
                //         {
                //             margin: [20, 0, -10, 0],
                //             style: 'tableExample',
                //             table: {
                //                 body: [

                //                     [{ text: 'The details of the outstanding amount are as follows:-'}]
                //                 ]
                //             }, layout: 'noBorders'
                //         },
                //     ],
                // },

            ]
        },

        footer: function (currentPage, pageCount) {
            return [

                { text: 'Note: All cheque(s) should be made payable to "SIRIM QAS International Sdn. Bhd." If payment is made by EFT/IBG/RENTAS/TT/CHEQUE DEPOSIT, please fax the remittance advice/bank slip to +603 55445672 or e-mail to mrazi@sirim.my to facilitate us in issuing receipt. Please indicate invoice number for the payment made. Our bank details: RHB BANK BERHAD- Shah Alam/A/C No. 2-12451-4008608-7 Swift Code: RHBBMYKL', bold: true, margin: [20, 70, 20, 0] },
                { text: '\nPage ' + currentPage + ' of ' + pageCount, alignment: 'center' },
            ]
            currentPage.toString() + ' of ' + pageCount;
        },
    }

    // var pdfDoc = printer.createPdfKitDocument(docDefinition);
    // var filepath = __dirname + + filename
    // pdfDoc.pipe(fs.createWriteStream(__dirname + '/finals.pdf'));
    // pdfDoc.filepath = filepath;
    // pdfDoc.end();

    try {
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        // pdfDoc.pipe(blobStream());
        var fileName = dateFormat(new Date(), "dd_mmmm_yyyy_HH_mm_ss") + '.pdf';
        var filePath = __dirname + '\\PDF_File\\' + fileName;
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.fileName = fileName;
        pdfDoc.filePath = filePath;
        pdfDoc.end();
    } catch (error) {
        console.log("File error : " + error)
    }

    logger.info("eqe ")
    return pdfDoc;
}