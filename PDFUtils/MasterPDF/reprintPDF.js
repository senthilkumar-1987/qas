

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



exports.downloadmasterpdf = async (req, res) => {

    let sessionObj = req.userData;
    let inputData = req.body;

    let resObj = {};
    try {

        console.log("------------------------------------------");
        // logger.info("inputData   " + JSON.stringify(inputData))
        let InvoiceMAsterpdf = await invoiceDetails.InvoiceMasterdetails(inputData.Invoiceno)
        // logger.info("InvoiceMAsterpdf " + JSON.stringify(InvoiceMAsterpdf))
        // resObj = await this.pdfgenerate(InvoiceMAsterpdf);
        // res.writeHead(200, {
        //     "Content-Type": "application/pdf",
        //     'Content-disposition': 'attachment; filename=' + resObj.docName + '.pdf'
        // });

        resObj.streamData = await this.pdfgenerate(InvoiceMAsterpdf);

        resObj.docName = inputData.Invoiceno;

    } catch (error) {
        logger.info("ERROR == > " + error)
    }

    return resObj;
}


exports.pdfgenerate = async (InvoiceMAsterpdf, PdfContacts, address) => {

    console.log("pdfgenerate--> REPRINT");
    // let data = dataList[0];
    let subTotal = 0;
    let serviceTotalAmt = 0;
    let grandTotal = 0;
    let PdfContactss;
    let cityName;
    let stateName;
    let countryName;
    let Totals;
    let GST = 0;
    let subTotals = 0
    let OfficeNo = '';
    let AdvancePaidAmount = 0;
    let TotalSales = 0;


    // logger.info("InvoiceMAsterpdf=>" + InvoiceMAsterpdf.length);
    let singleInvoiceData = InvoiceMAsterpdf[0];



    console.log("INVOICE_NO-- > " + JSON.stringify(InvoiceMAsterpdf));
    let InvoiceArray = [];
    for (let index = 0; index < InvoiceMAsterpdf.length; index++) {
        const element = InvoiceMAsterpdf[index];
        let INV = element.Invoice_no.substring(3);

        InvoiceArray.push(INV);

    }
    console.log("INVOICE_NO-- > " + JSON.stringify(InvoiceArray));

    InvNum = InvoiceArray.toString();
    console.log("InvNum" + JSON.stringify(InvNum));





    if (singleInvoiceData.Currency !== "MYR") {

        Totals = singleInvoiceData.Total_amount;

    } else {

        Totals = singleInvoiceData.Total_amount_rm;
    }
    console.log("Totals--- " + JSON.stringify(Totals))


    if (PdfContacts.length !== 0) {
        PdfContactss = PdfContacts[0];
        console.log("CONT--=" + JSON.stringify(PdfContacts))
        OfficeNo = PdfContactss.OfficeNo


    } else {
        OfficeNo = ''
        console.log("else" + JSON.stringify(OfficeNo))
    }


    if (address) {
        console.log("address--" + JSON.stringify(address))
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
            countryName = (addressDetails.Country[0].CountryName === null || addressDetails.Country[0].CountryName === 'null' || addressDetails.Country[0].CountryName === 'N/A' || addressDetails.Country[0].CountryName === undefined || addressDetails.Country[0].CountryName === "") ? '' : addressDetails.Country[0].CountryName;
        } else {
            countryName = ''
        }
    }

    logger.info("InvoiceMAsterpdf=>" + JSON.stringify(singleInvoiceData.Invoice_no));
    // logger.info("InvoiceMAsterpdf=>" + JSON.stringify(singleInvoiceData.Invoice_no)[0]);
    // var str = singleInvoiceData.Invoice_no;
    let REFF = '';
    if (singleInvoiceData.MasterInvoiceNo != null && singleInvoiceData.MasterInvoiceNo != '') {
        var str = singleInvoiceData.MasterInvoiceNo === undefined ? singleInvoiceData.MasterInvoiceNo : singleInvoiceData.MasterInvoiceNo;
        REFF = str.substring(3);
    }

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
        { text: 'Invoice No', style: 'tableHeader', bold: true, alignment: 'left' },
        // { text: 'Quotation No', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Description', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'File No ', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'License No ', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Job Date ', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Expiry Date ', style: 'tableHeader', bold: true, alignment: 'left' },
        // { text: 'Total', style: 'tableHeader', bold: true, alignment: 'left' },
        { text: 'Total (MYR) ', style: 'tableHeader', bold: true, alignment: 'center' },
    ];

    temp.push(itemListHeader);
    for (let index = 0; index < InvoiceMAsterpdf.length; index++) {
        const InvoiceMAster = InvoiceMAsterpdf[index];
        logger.info("\n\nPDFINCLUDE\n" + JSON.stringify(InvoiceMAster))
        let columnWidth = 'width:auto';
        // grandTotal = grandTotal + Number(InvoiceMAster.Currency === 'MYR' ? InvoiceMAster.Sub_total_rm.toFixed(2) : InvoiceMAster.Sub_total.toFixed(2));
        console.log("subTotalssss " + subTotals)
        console.log("InvoiceMAsterpdf.length " + InvoiceMAsterpdf.length)
        // if (InvoiceMAster.Currency !== "MYR") {
        //     subTotals = Number(subTotals) + Number(InvoiceMAster.Total_amount);
        // } else {
        // subTotals = Number(subTotals) + Number(InvoiceMAster.Total_amount_rm);
        console.log("InvoiceMAster.Total_amosunt_rm\n" + InvoiceMAster.Total_amount_rm)
        console.log("InvoiceMAster.Total_amount_rm\n" + subTotals)
        // }
        TotalSales = Number(TotalSales) + Number(InvoiceMAster.Total_amount_rm);
        console.log("TotalSales ^^^ -" + JSON.stringify(TotalSales));

        // if (InvoiceMAster.Currency !== "MYR") {
        //     GST = Number(GST) + Number(InvoiceMAster.Gst_amount);
        // } else {
        GST = Number(GST) + Number(InvoiceMAster.Gst_amount_rm);
        console.log("GST ^^^ -" + JSON.stringify(GST));
        // }
        AdvancePaidAmount = AdvancePaidAmount + Number(InvoiceMAster.Advance_paid_amount);
        console.log("AdvancePaidAmount ^^^ -> " + JSON.stringify(AdvancePaidAmount));

        grandTotal = Number(GST) + Number(TotalSales) + Number(AdvancePaidAmount);

        console.log("grandTotal ^^^ -" + JSON.stringify(grandTotal));
        // subTotal = subTotal + Number(InvoiceMAster.Total_amount_rm);
        console.log("datee----" + singleInvoiceData.Expiry_date);
        // console.log("datee----" + moment.utc(singleInvoiceData.Expiry_date).format('DD/MM/YYYY'));

        let records = [
            { text: index + 1, alignment: 'left' },
            { text: InvoiceMAster.Invoice_no, alignment: 'left' },
            // { text: InvoiceMAster.Quotation_no, alignment: 'left' },
            { text: InvoiceMAster.Costing_type, alignment: 'left' },
            { text: InvoiceMAster.File_no, alignment: 'left' },
            { text: InvoiceMAster.License_no, alignment: 'left' },
            { text: (InvoiceMAster.Job_date === null || InvoiceMAster.Job_date === '') ? '' : dateFormat(InvoiceMAster.Job_date, "dd-mm-yyyy"), alignment: 'left' },
            { text: (InvoiceMAster.Expiry_date === null || InvoiceMAster.Expiry_date === '') ? '' : dateFormat(InvoiceMAster.Expiry_date, 'dd-mm-yyyy'), alignment: 'left' },
            // { text: InvoiceMAster.Sub_total_rm.toFixed(2), alignment: 'left' },
            { text: (InvoiceMAster.Total_amount_rm.toFixed(2)), alignment: 'center' },
        ];
        temp.push(records);
    }




    const line = { type: 'line', x1: 0, y1: 10, x2: 100, y2: 10, lineWidth: 1.0, lineColor: '#000000' };

    var docDefinition = {


        background: [
            // {
            //     image: imageDir + '/JomPay_Icon.png',
            //     // width: 50, margin: [50, 305, 0, 20]
            //     width: 50, margin: [340, 305, 0, 20]
            // }, { text: 'JomPAY online at internet and mobile banking with \n your Current,Savings or Credit Card account', fontSize: 5, margin: [340, -22, 0, 20] },
            {
                image: imageDir + '/wm.png',//imageDir + '/JomPay_Icon.PNG',
                width: 320, margin: [120, 210, 0, 20]
            },
        ],
        info: {
            title: 'awesome Document',
            author: 'john doe',
            subject: 'subject of document',
            keywords: 'keywords for document',
        },
        content: [
            {
                // unbreakable: false,
                // dontBreakRows: true,
                headerRows: 2, keepWithHeaderRows: false,
                style: 'tableExample',
                margin: [-18, -150, 0, -50],
                table: {
                    widths: [20, 60, 60, 50, 50, 50, 60, 70],
                    body:
                        temp,
                }, layout: 'headerLineOnly', fillColor: '#D9E3FF'

            },

            {
                style: 'tableExample',
                margin: [345, 65, 0, 0],
                table: {
                    widths: ['auto', 'auto', 'auto',],
                    body: [
                        [{ text: '' }, { text: '' }, { text: '', alignment: 'right' }],
                        [{ text: 'Total Sales' }, { text: ':' }, { text: (TotalSales) ? (TotalSales).toFixed(2) : '0.00', alignment: 'right' }],
                        [{ text: 'Less Advance paid' }, { text: ':' }, { text: (AdvancePaidAmount) ? (AdvancePaidAmount).toFixed(2) : '0.00', alignment: 'right' }],
                        [{ text: 'Net Sales after Advance' }, { text: ':' }, { text: '0.00', alignment: 'right' }],
                        [{ text: 'Add: Service Tax 6%' }, { text: ':' }, { text: (GST) ? (GST).toFixed(2) : '0.00', alignment: 'right' }],
                        [{ text: 'Rounding Adjustment' }, { text: ':' }, { text: '0.00', alignment: 'right' }],
                        [{ text: 'Total Amount Payable', bold: true }, { text: ':' }, { text: (grandTotal) ? (grandTotal).toFixed(2) : '0.00', alignment: 'right' }],
                    ]
                }, layout: 'noBorders'
            },

            {
                columns: [

                    {
                        style: 'tableExample',
                        margin: [0, 20, 0, 0],
                        table: {
                            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                            body: [
                                [{ text: 'Prepared By', bold: true }, { text: ':' }, { text: "" + singleInvoiceData.Prepared_by === null ? '' : singleInvoiceData.Prepared_by }, { text: '', bold: true }, { text: '' }, { text: "" }],
                                // [{ text: 'Remark', bold: true }, { text: ':' }, { text: singleInvoiceData.Remarks == null ? '' : singleInvoiceData.Remarks }, { text: '', bold: true }, { text: '' }, { text: "" }]
                            ]
                        }, layout: 'noBorders'
                    },
                    {
                        style: 'tableExample',
                        margin: [15, 20, 0, 0],
                        table: {

                            widths: ['auto', 'auto', 'auto',],
                            body: [
                                [{ text: 'Approved By', bold: true }, { text: ':' }, { text: singleInvoiceData.Approved_by === null ? '' : singleInvoiceData.Approved_by }],
                            ]
                        }, layout: 'noBorders'
                    }
                ],
            },

            {
                style: 'tableExample',
                // margin: [0, 20, 0, 0],
                table: {
                    widths: ['auto', 'auto', 'auto'],
                    body: [
                        [{ text: 'Remark', bold: true }, { text: ':', margin: [20, 0, 0, 0] }, { text: singleInvoiceData.Remarks === null || singleInvoiceData.Remarks === 'null' ? '' : singleInvoiceData.Remarks }]

                    ]
                }, layout: 'noBorders'
            },





        ], defaultStyle: {
            font: 'Verdana',
            fontSize: 8
        },



        pageMargins: [40, 520, 40, 220],
        header: function (currentPage, pageCount) {
            return [
                {
                    alignment: 'justify',
                    margin: [20, 20, 0, 0],
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
                            width: 35, margin: [15, 35, 0, 0],

                            // width: 50, margin: [50, 305, 0, 20]
                        },
                        {
                            style: 'tableExample',
                            margin: [15, 35, 0, 0],
                            table: {
                                widths: [50, 50],
                                heights: [10, 10, 0],
                                body: [
                                    [{ text: 'Biller Code', bold: true, alignment: 'center' }, '35394'],
                                    [{ text: 'Ref-1', bold: true }, singleInvoiceData.MasterInvoiceNo === null ? '' : singleInvoiceData.MasterInvoiceNo],
                                ]
                            }
                        },
                    ],
                },
                { text: 'JomPAY online at internet and mobile banking with \n your Current,Savings or Credit Card account', fontSize: 5, margin: [390, 2, 0, 0] },
                {
                    margin: [10, 15, -30, 65],
                    columns: [
                        {
                            style: 'tableExample',
                            margin: [10, 15, -10, 0],
                            table: {
                                widths: ['auto', 'auto', 'auto'],
                                body: [
                                    [{ text: 'ID No.', bold: true }, ':', { text: singleInvoiceData.Customer_id === null ? '' : singleInvoiceData.Customer_id, bold: true }],
                                    [{ text: 'Name', bold: true }, ':', { text: singleInvoiceData.Company_name === null || singleInvoiceData.Company_name === 'null' ? '' : singleInvoiceData.Company_name, bold: true }],
                                    [{ text: 'Address ', bold: true }, ':', { text: (singleInvoiceData.Manufacturer_address1 === null || singleInvoiceData.Manufacturer_address1 === 'null') ? '' : singleInvoiceData.Manufacturer_address1, bold: true }],
                                    [{ text: '', bold: true }, '', {
                                        text: ((singleInvoiceData.Manufacturer_address2 === null || singleInvoiceData.Manufacturer_address2 === 'null') ? '' : singleInvoiceData.Manufacturer_address2) + ((singleInvoiceData.Manufacturer_address3 === null || singleInvoiceData.Manufacturer_address3 === 'null' || singleInvoiceData.Manufacturer_address3
                                            === undefined) ? '' : singleInvoiceData.Manufacturer_address3), bold: true
                                    }],
                                    // [{ text: '', bold: true }, '', { text: singleInvoiceData.Manufacturer_address3, bold: true }],
                                    [{ text: '', bold: true }, '', { text: cityName + " " + stateName + " " + countryName + " " + ((singleInvoiceData.Postcode === null || singleInvoiceData.Postcode === 'null') ? '' : singleInvoiceData.Postcode), bold: true }],
                                    [{ text: 'Attention ', bold: true }, ':', { text: singleInvoiceData.Customer_name === null || singleInvoiceData.Customer_name === 'null' ? '' : singleInvoiceData.Customer_name, bold: true }],
                                ]
                            },
                            layout: 'noBorders'
                        },
                        {
                            margin: [75, 15, -50, 0],
                            style: 'tableExample',
                            table: {
                                widths: ['auto', 'auto', 'auto'],
                                body: [
                                    [{ text: 'Date ', bold: true }, ':', { text: newDate, bold: true }],
                                    [{ text: 'Your PO No ', bold: true }, ':', { text: singleInvoiceData.Po_no === null || singleInvoiceData.Po_no === 'null' ? '' : singleInvoiceData.Po_no, bold: true }],
                                    [{ text: 'Batch No ', bold: true }, ':', { text: singleInvoiceData.MasterInvoiceNo === null ? '' : singleInvoiceData.MasterInvoiceNo, bold: true }],
                                    [{ text: 'Tel No ', bold: true }, ':', { text: OfficeNo === null ? '' : OfficeNo, bold: true }],
                                    [{ text: 'Completion Date ', bold: true }, ':', { text: dateFormat(singleInvoiceData.Completion_date, "dd-mm-yyyy"), bold: true }],
                                ]
                            },
                            layout: 'noBorders'
                        },
                    ]
                },
            ]
        },

        footer: function (currentPage, pageCount, nodesOnNextPage) {
            return [
                {
                    text: [
                        { text: '\nCREDIT TERM IS STRICTLY 30 DAYS ', bold: true, }, '\nCheque to be made payable to', { text: ' SIRIM QAS INTERNATIONAL SDN BHD', bold: true }, { text: ' \n Payment can alsoi be made into RHB account number 2-12451-4008608-7/Swift code RHBBMYKL. Please send the bank-in-slip/payment advice by e-mail to finqas@sirim.my or fax to 603-55445672 as  proof of payment. Receipt based on request only.' },
                    ],
                    margin: [20, 50, 20, 0]
                },
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
    logger.info("eqe ")
    return pdfDoc;
}


exports.downloadSampleInvoicepdf = async (req, res) => {

    console.log("----AAA---- ");
    let sessionObj = req.userData;
    let inputData = req.body;
    let resObj = {};
    try {
        logger.info("inputData   " + JSON.stringify(inputData))
        if (inputData.MasterInvoiceNo && inputData.MasterInvoiceNo != null && inputData.MasterInvoiceNo != '') {
            let InvoiceMAsterpdf = await invoiceDetails.InvoiceMasterdetailsByMasterInvoiceNo(inputData.MasterInvoiceNo)
            let PdfContacts = await invoiceDetails.PDFContacts('', '', inputData.MasterInvoiceNo);
            let address = await invoiceDetails.Address(InvoiceMAsterpdf);
            console.log("ADD -- > " + JSON.stringify(address));
            resObj.streamData = await this.pdfgenerate(InvoiceMAsterpdf, PdfContacts, address);
            resObj.docName = inputData.Invoiceno;
        }

    } catch (error) {
        logger.info("ERROR == > " + error)
    }

    return resObj;
}