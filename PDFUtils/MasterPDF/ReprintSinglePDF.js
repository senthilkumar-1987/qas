

// New File
let invoiceDetails = require('../../repositories/PaymentRepository/Customers/ViewInvoices');
// const pdfMakePrinter = require('pdfmake');
/* var pdfMake = require('./pdfmake'); */
// var fs = require('fs');
var logger = require('../../logger');

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

let newDate = dateFormat(new Date(), 'dd-mm-yyyy');
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
















exports.pdfgenerateSingleInvocie = async (InvoiceMAsterpdf, PdfContacts, address) => {

    console.log("pdfgenerateSingleInvocie-->");

    let subTotal = 0.00;
    let serviceTotalAmt = 0.00;
    let grandTotal = 0.00;
    let PdfContactss;
    let Totals = 0.00;
    let GST = 0;
    let subTotals;
    let cityName = '';
    let stateName = '';
    let countryName = '';
    let OfficeNo = '';
    let TotalSales = 0.00;
    let GSTTotal = 0.00;
    let AmountPay = 0.00;

    logger.info("InvoiceMAsterpdf=>" + JSON.stringify(InvoiceMAsterpdf));
    let singleInvoiceData = InvoiceMAsterpdf[0];
    let AdvancePaidAmount = 0.00;
    console.log("T----->" + JSON.stringify(singleInvoiceData.Invoice_no))

    // if (singleInvoiceData.Currency !== "MYR") {

    //     subTotals = singleInvoiceData.Sub_total;

    // } else {

    //     subTotals = singleInvoiceData.Sub_total_rm;
    // }
    // console.log("subTotal--- " + JSON.stringify(subTotals))


    // if (singleInvoiceData.Currency !== "MYR") {

    //     GST = singleInvoiceData.Gst_amount;

    // } else {

    //     GST = singleInvoiceData.Gst_amount_rm;
    // }
    // console.log("GST--- " + JSON.stringify(GST))


    if (singleInvoiceData.Currency !== "MYR") {

        Totals = singleInvoiceData.Total_amount;

    } else {

        Totals = singleInvoiceData.Total_Amount_Rm === null ? Number(0) : singleInvoiceData.Total_amount_rm;
    }
    console.log("Totals---M " + JSON.stringify(Totals))


    if (PdfContacts.length != 0) {
        PdfContactss = PdfContacts[0];
        OfficeNo = PdfContactss.OfficeNo
    } else {
        OfficeNo = ''
    }
    if (address) {
        console.log("address----" + JSON.stringify(address))
        let addressDetails = address;
        if (addressDetails.City !== null && addressDetails.City !== '') {
            cityName = (addressDetails.City[0].CityName === null || addressDetails.City[0].CityName === 'null' || addressDetails.City[0].CityName === 'N/A' || addressDetails.City[0].CityName === undefined) ? '' : addressDetails.City[0].CityName;
        } else {
            cityName = ''
        }
        console.log("C \n " + JSON.stringify(cityName));
        if (addressDetails.State !== null && addressDetails.State !== '') {


            stateName = (addressDetails.State[0].StateName == null || addressDetails.State[0].StateName === 'null' || addressDetails.State[0].StateName === 'N/A' || addressDetails.State[0].StateName === undefined) ? '' : addressDetails.State[0].StateName;
            console.log("stateName \n " + JSON.stringify(stateName));
        } else {
            stateName = ''
        }
        if (addressDetails.Country !== null && addressDetails.Country !== "") {
            countryName = (addressDetails.Country[0].CountryName === null || addressDetails.Country[0].CountryName === 'null' || addressDetails.Country[0].CountryName === 'N/A' || addressDetails.Country[0].CountryName === 'undefined' || addressDetails.Country[0].CountryName === "") ? '' : addressDetails.Country[0].CountryName;
        } else {
            countryName = ''
        }
    }
    logger.info("TableData--->" + JSON.stringify(singleInvoiceData.Invoice_no[0]));
    var str = singleInvoiceData.Invoice_no[0] === undefined ? singleInvoiceData.Invoice_no : singleInvoiceData.Invoice_no[0];
    let REFF = str.substring(3);

    logger.info("singleInvoiceData  " + JSON.stringify(singleInvoiceData))
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
        { text: 'Description', bold: true, alignment: 'left', margin: [-40, 0, 40, 0] },
        { text: 'Job Date ', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Expiry Date ', style: 'tableHeader', bold: true, alignment: 'left' },
        // { text: 'Total ', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Total (MYR) ', style: 'tableHeader', bold: true, alignment: 'center' },

    ];

    temp.push(itemListHeader);
    console.log(InvoiceMAsterpdf.length)
    subTotal = 0.00
    serviceTotalAmt = 0.00
    grandTotal = 0.00

    for (let index = 0; index < InvoiceMAsterpdf.length; index++) {
        const InvoiceMAster = InvoiceMAsterpdf[index];
        let columnWidth = 'width:auto';
        console.log("InvoiceMAster.Expiry_datesss  " + JSON.stringify(InvoiceMAster));
        // logger.info(index + " InvoiceMAster.Sub_total_rmsss " + JSON.stringify(InvoiceMAster.Sub_total_rm))
        // grandTotal = grandTotal + Number(InvoiceMAster.Sub_total_rm);
        // grandTotal = Number(grandTotal) + Number(InvoiceMAster.Currency === 'MYR' ? InvoiceMAster.Sub_total_rm.toFixed(2) : InvoiceMAster.Sub_total.toFixed(2));
        // console.log("subTotalsubTotalsss\n" + subTotal + " " + InvoiceMAster.Total_amount)
        // if (InvoiceMAster.Currency !== "MYR") {
        //     subTotal = Number(subTotal) + Number(InvoiceMAster.Total_amount[0]);
        // } else {
        //     subTotal = Number(subTotal) + Number(InvoiceMAster.Total_Amount_Rm);
        // }

        TotalSales = Number(TotalSales) + InvoiceMAster.Total_Amount_Rm === null ? Number(0) : Number(InvoiceMAster.Total_Amount_Rm);

        GST = Number(GST) + InvoiceMAster.Gst_Amount_Rm === null ? Number(0) : Number(InvoiceMAster.Gst_Amount_Rm);

        console.log("GSTT-----" + JSON.stringify(GST));

        // AmountPay = (Number(TotalSales) + Number(GST));

        // if (InvoiceMAster.Currency !== "MYR") {
        //     serviceTotalAmt = Number(serviceTotalAmt) + Number(InvoiceMAster.Gst_amount[0]);
        // } else {
        //     serviceTotalAmt = Number(serviceTotalAmt) + Number(InvoiceMAster.Gst_amount_rm);
        // }
        // AdvancePaidAmount = Number(AdvancePaidAmount) + Number(InvoiceMAster.Advance_paid_amount);
        grandTotal = Number(GST) + Number(TotalSales);

        console.log("grandTotal ^^^ -" + JSON.stringify(grandTotal));


        // serviceTotalAmt = serviceTotalAmt + Number(InvoiceMAster.Gst_amount_rm);
        // subTotal = subTotal + Number(InvoiceMAster.Total_amount_rm);
        let discreptionText = InvoiceMAster.Item_desc != null ? InvoiceMAster.Item_desc : ''
        console.log("discreptionText" + JSON.stringify(InvoiceMAster.Item_desc))
        let product = ((InvoiceMAster.Product_Name === undefined || InvoiceMAster.Product_Name === null) ? '' : InvoiceMAster.Product_Name)
        let licenceNo = ((InvoiceMAster.License_no === null || InvoiceMAster.License_no === undefined) ? '' : InvoiceMAster.License_no)

        let InspName = ((InvoiceMAster.Inspector_Name === null || InvoiceMAster.Inspector_Name === 'null' || InvoiceMAster.Inspector_Name === undefined) ? '' : InvoiceMAster.Inspector_Name)
        let AuditName = 'Location Audit/Inspection : ' + ((InvoiceMAster.Auditor_Name === null || InvoiceMAster.Auditor_Name === undefined || InvoiceMAster.Auditor_Name === 'null') ? '' : InvoiceMAster.Auditor_Name)
        let Job_id = 'Job No : ' + ((InvoiceMAster.Job_No === null || InvoiceMAster.Job_No === undefined) ? '' : InvoiceMAster.Job_No) + " \n" + 'IB/AB/CB : ' + ''

        let records = [
            { text: index + 1, alignment: 'left' },
            { text: discreptionText + "  " + '\nProduct Name : ' + product + "\n " + 'License No: ' + licenceNo + " \n " + 'PO/ Inspector Name : ' + InspName + "\n " + AuditName + " \n" + Job_id, alignment: 'left', margin: [-60, 0, 30, 0] },
            { text: (InvoiceMAster.Job_date === null || InvoiceMAster.Job_date === '') ? '' : dateFormat(InvoiceMAster.Job_date, "dd-mm-yyyy"), alignment: 'left', style: 'tableHeader' },
            { text: (InvoiceMAster.Expiry_date === null || InvoiceMAster.Expiry_date === '') ? '' : dateFormat(InvoiceMAster.Expiry_date[0], "dd-mm-yyyy"), alignment: 'left' },
            // { text: InvoiceMAster.Amount, alignment: 'center', margin: [0, 0, 40, 0] },
            // { text: Totals === null || Totals === '' ? '' : Totals.toFixed(2), alignment: 'center' },
            // { text: InvoiceMAster.Currency === 'MYR' ? InvoiceMAster.Sub_total_rm.toFixed(2) : InvoiceMAster.Sub_total.toFixed(2), alignment: 'center' },
            { text: (InvoiceMAster.Total_Amount_Rm === null ? Number(0.00) : InvoiceMAster.Total_Amount_Rm).toFixed(2), alignment: 'center' }
        ];
        temp.push(records);
    }
    logger.info(" InvoiceMAster.grandTotal " + JSON.stringify(grandTotal))


    // const line = { type: 'line', x1: 0, y1: 10, x2: 100, y2: 10, lineWidth: 1.0, lineColor: '#000000' };

    var docDefinition = {

        background: [
            // {
            //     image: imageDir + '/JomPay_Icon.png',//imageDir + '/JomPay_Icon.PNG',
            //     width: 50, margin: [340, 305, 0, 20],

            //     // width: 50, margin: [50, 305, 0, 20]
            // }, { text: 'JomPAY online at internet and mobile banking with \n your Current,Savings or Credit Card account', fontSize: 5, margin: [340, -22, 0, 20] },
            {
                image: imageDir + '/wm.png',//imageDir + '/JomPay_Icon.PNG',
                width: 320, margin: [120, 210, 0, 20]
            },
        ],


        content: [
            {
                style: 'tableExample',
                margin: [-18, -130, 5, 0],
                table: {

                    widths: ['*', 130, '*', '*', '*'],
                    body:

                        temp,

                }, layout: 'headerLineOnly', fillColor: '#D9E3FF',
                // layout: {
                //     fillColor: function (rowIndex, node, columnIndex) {
                //         return (rowIndex % 0 === 0) ? '#CCCCCC' : null;
                //     }
                // }

            }, {
                style: 'tableExample',
                margin: [340, 10, 0, 0],
                table: {
                    widths: ['auto', 'auto', 'auto'],
                    body: [
                        // if(currentPage.equal() ) {
                        [{ text: 'Total Sales' }, { text: ':' }, { text: (TotalSales).toFixed(2), alignment: 'right' }],
                        [{ text: 'Less Advance paid' }, { text: ':' }, { text: (AdvancePaidAmount) ? AdvancePaidAmount.toFixed(2) : '0.00', alignment: 'right' }],
                        [{ text: 'Net Sales after Advance' }, { text: ':' }, { text: '0.00', alignment: 'right' }],
                        [{ text: 'Add: Service Tax 6%' }, { text: ':' }, { text: (GST) ? (GST).toFixed(2) : '0.00', alignment: 'right' }],
                        [{ text: 'Rounding Adjustment' }, { text: ':' }, { text: '0.00', alignment: 'right' }],
                        [{ text: 'Total Amount Payable', bold: true }, { text: ':' }, { text: (grandTotal) ? (grandTotal).toFixed(2) : '0.00', alignment: 'right' }],
                        // }
                    ]
                }, layout: 'noBorders'
            },
            {
                columns: [
                    {
                        style: 'tableExample',
                        margin: [0, 5, 0, 0],
                        table: {

                            widths: ['auto', 'auto', 'auto'],
                            body: [

                                [{ text: 'Prepared By', bold: true }, { text: ':' }, { text: singleInvoiceData.Prepared_by === null ? '' : singleInvoiceData.Prepared_by }],
                                // [{ text: 'Remark', bold: true }, { text: ':' }, { text: singleInvoiceData.Remarks == null ? '' : singleInvoiceData.Remarks }],
                            ]
                        }, layout: 'noBorders'
                    },
                    {
                        style: 'tableExample',
                        margin: [25, 5, 0, 0],
                        table: {
                            widths: ['auto', 'auto', 'auto'],
                            body: [
                                // [{ text: '', bold: true }, { text: '' }, { text: '' }],
                                [{ text: 'Approved By', bold: true }, { text: ':' }, { text: singleInvoiceData.Approved_by === null ? '' : singleInvoiceData.Approved_by }],
                            ]
                        }, layout: 'noBorders'
                    },
                ],
                // columns: [
                //    {
                //         style: 'tableExample',
                //         margin: [20, 10, 0, 0],
                //         table: {

                //             widths: ['auto', 'auto', 'auto'],
                //             body: [
                //                 [{ text: '\nRemarks : ', bold: true }, { text: ':' }, { text: singleInvoiceData.Remarks === (undefined || null) ? '' : singleInvoiceData.Remarks }],
                //             ]
                //         }, layout: 'noBorders'
                //     },
                // ],
            },

            {
                style: 'tableExample',
                // margin: [0, 20, 0, 0],
                table: {
                    widths: ['auto', 'auto', 'auto'],
                    body: [
                        [{ text: 'Remark', bold: true }, { text: ':' }, { text: singleInvoiceData.Remarks == null || singleInvoiceData.Remarks == 'null' ? '' : singleInvoiceData.Remarks }]

                    ]
                }, layout: 'noBorders'
            },



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

                        { text: '', alignment: 'left', bold: true, fontSize: 0 },

                        { text: '\nINVOICE', alignment: 'center', bold: true, fontSize: 20 },

                        {
                            image: imageDir + '/JomPay_Icon.png',//imageDir + '/JomPay_Icon.PNG',
                            width: 35, margin: [10, 35, 0, 0],

                            // width: 50, margin: [50, 305, 0, 20]
                        },


                        {
                            style: 'tableExample',
                            margin: [10, 35, 0, 0],
                            table: {
                                heights: [10, 10, 0],
                                body: [
                                    [{ text: 'Biller Code', bold: true, alignment: 'center' }, '35394'],
                                    [{ text: 'Ref-1', bold: true }, REFF],
                                ]
                            }
                        },

                    ],
                },

                { text: 'JomPAY online at internet and mobile banking with \n your Current,Savings or Credit Card account', fontSize: 5, margin: [385, 2, 0, 0] },
                {
                    margin: [10, 15, -30, 0],
                    columns: [
                        {
                            style: 'tableExample',
                            margin: [10, 15, -10, 0],
                            table: {
                                widths: ['auto', 'auto', 'auto'],
                                body: [

                                    [{ text: 'ID No.', bold: true }, ':', { text: singleInvoiceData.Customer_id === null ? '' : singleInvoiceData.Customer_id, bold: true }],
                                    [{ text: 'Name', bold: true }, ':', { text: singleInvoiceData.Company_name === null ? '' : singleInvoiceData.Company_name, bold: true }],
                                    [{ text: 'Address ', bold: true }, ':', { text: (singleInvoiceData.Manufacturer_address1 === null || singleInvoiceData.Manufacturer_address1 === "undefined") ? '' : singleInvoiceData.Manufacturer_address1, bold: true }],
                                    [{ text: '', bold: true }, '', { text: ((singleInvoiceData.Manufacturer_address2 === null || singleInvoiceData.Manufacturer_address2 === "undefined") ? '' : singleInvoiceData.Manufacturer_address2) + " " + ((singleInvoiceData.Manufacturer_address3 === null || singleInvoiceData.Manufacturer_address3 === undefined) ? '' : singleInvoiceData.Manufacturer_address3), bold: true }],
                                    [{ text: '', bold: true }, '', { text: cityName + " " + stateName + " " + countryName + " " + ((singleInvoiceData.Postcode === null || singleInvoiceData.Postcode === 'null') ? '' : singleInvoiceData.Postcode), bold: true }],
                                    //  [{ text: '', bold: true }, ':', { text: 'REGION RUSSIAN FEDERATION', bold: true }],
                                    [{ text: 'Attention ', bold: true }, ':', { text: singleInvoiceData.Customer_name === null || singleInvoiceData.Customer_name === 'null' ? '' : singleInvoiceData.Customer_name, bold: true }],
                                ]
                            },
                            layout: 'noBorders'
                        },

                        {
                            margin: [67, 15, -50, 0],
                            style: 'tableExample',
                            table: {
                                widths: ['auto', 'auto', 'auto'],
                                body: [
                                    [{ text: 'Invoice No ', bold: true }, ':', { text: singleInvoiceData.Invoice_no, bold: true }],
                                    [{ text: 'Date  ', bold: true }, ':', { text: dateFormat(singleInvoiceData.Invoice_date, "dd-mm-yyyy"), bold: true }],
                                    [{ text: 'Your PO No  ', bold: true }, ':', { text: singleInvoiceData.Po_no === null || singleInvoiceData.Po_no === 'null' ? '' : singleInvoiceData.Po_no, bold: true }],
                                    [{ text: 'File No', bold: true }, ':', { text: singleInvoiceData.File_no === null ? '' : singleInvoiceData.File_no, bold: true }],
                                    [{ text: 'Tel No ', bold: true }, ':', { text: OfficeNo === null ? '' : OfficeNo, bold: true }],
                                    [{ text: 'Completion Date', bold: true }, ':', { text: dateFormat(singleInvoiceData.Completion_date, "dd-mm-yyyy"), bold: true }],
                                ]
                            },
                            layout: 'noBorders'
                        },

                    ]
                },

            ]
        },

        footer: function (currentPage, pageCount, lastPage) {
            logger.info("lastPage : " + JSON.stringify(currentPage))
            return [

                //  return [
                {

                    text: [
                        { text: '\nCREDIT TERM IS STRICTLY 30 DAYS ', bold: true, }, '\nCheque to be made payable to', { text: ' SIRIM QAS INTERNATIONAL SDN BHD', bold: true }, { text: ' \n Payment can alsoi be made into RHB account number 2-12451-4008608-7/Swift code RHBBMYKL. Please send the bank-in-slip/payment advice by e-mail to finqas@sirim.my or fax to 603-55445672 as  proof of payment. Receipt based on request only.' },
                    ],
                    margin: [20, 40, 20, 0]
                },

                //{ canvas: [Object.assign({}, line)] },
                //margin: [-18, 15, -50, 0],
                // { canvas: [Object.assign({}, line)], margin: [20, 70, 0, 0] },
                { text: 'THIS IS A COMPUTER GENERATED DOCUMENT. NO SIGNATURE IS REQUIRED', alignment: 'center', margin: [20, 40, 0, 0] },
                { text: '\nPage ' + currentPage + ' of ' + pageCount, alignment: 'center' },

            ]
            currentPage.toString() + ' of ' + pageCount;
        },


    }

    // var pdfDoc = printer.createPdfKitDocument(docDefinition);
    // var filepath = __dirname + + filename
    // pdfDoc.pipe(fs.createWriteStream(__dirname + '/final.pdf'));
    // // pdfDoc.pipe(fs.createWriteStream('/Desktop/final.pdf'));
    // pdfDoc.filepath = filepath;
    // //  pdfDoc.pipe(blobStream());
    // pdfDoc.end();

    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(blobStream());
    pdfDoc.end();

    return pdfDoc;
}


exports.downloadSampleInvoicepdf = async (req, res) => {

    let sessionObj = req.userData;
    let inputData = req.body;
    let resObj = {};
    try {

        if (inputData.Invoiceno && inputData.Invoiceno != null && inputData.Invoiceno != '') {
            let InvoiceMAsterpdf = await invoiceDetails.GetSingleInvoiceData(inputData.Invoiceno);
            console.log("Reprint-Single_____" + JSON.stringify(InvoiceMAsterpdf));
            let PdfContacts = await invoiceDetails.PDFContacts('', inputData.Invoiceno);
            let address = await invoiceDetails.Address(InvoiceMAsterpdf);
            resObj.streamData = await this.pdfgenerateSingleInvocie(InvoiceMAsterpdf, PdfContacts, address);
            resObj.docName = inputData.Invoiceno;
        }

    } catch (error) {
        logger.info("ERROR == > " + error)
    }

    return resObj;
}
