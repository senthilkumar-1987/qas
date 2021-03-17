let paymentsReportsDetails = require('../../../repositories/PaymentRepository/Finance/PaymentReportsRepository');

let responseDto = require('../../../config/ResponseDto')


var constants = require('../../../config/PaymentConstants');



let GetpaymentTransactionListing = async (req, res) => {

  try {
    //  console.log(req.query.invoiceNo)
    let paymentDetails = req.body;
    // console.log(req.body);

    let paymentDetailsResponse = await paymentsReportsDetails.Load_Payments_Reports(paymentDetails);

    // console.log(paymentDetailsResponse)

    return res.json(new responseDto(constants.STATUS_SUCCESS, '', paymentDetailsResponse));
  } catch (e) {
    console.log(e)
    return res.json(new responseDto(constants.STATUS_FAIL, e, ''));

  }
}

let summary_of_payments = async (req, res) => {

  try {
    // console.log(req.query)
    let paymentDetails = req.body;
    // console.log(req.body);
    let summaryResponse = [];
    let processInvoices = [];
    let unprocessedInvoices = []
    let paymentDetailsResponse = await paymentsReportsDetails.Summary_of_Payments(paymentDetails);
    //  console.log(JSON.stringify(paymentDetailsResponse.unprocessedInvoices));
    processInvoices = paymentDetailsResponse.processedInvoices;
    unprocessedInvoices = paymentDetailsResponse.unprocessedInvoices;


    // console.log("paymentDetailsResponse>>" + JSON.stringify(paymentDetailsResponse))


    if (paymentDetailsResponse.processedInvoices !== null) {
      processInvoices.forEach(processedInvoices => {
        // console.log(processedInvoices.user_name);
        unprocessedInvoices.forEach(unprocessedInvoices => {
          // console.log(unprocessedInvoices.user_name)
          if (processedInvoices.user_name == unprocessedInvoices.user_name) {
            // console.log(unprocessedInvoices);
            let response = {}

            response.user_name = unprocessedInvoices.user_name;
            response.processedCunt = processedInvoices.processed_count;
            response.processeingCount = unprocessedInvoices.processeing_count;
            response.totalAmount = processedInvoices.total_amount;
            //  console.log(response);
            summaryResponse.push(response)
          }
        });

      });
    }
    // console.log(summaryResponse)

    let paymentDetailsResponses = await paymentsReportsDetails.SummaryofPayments2(paymentDetails);



    return res.json(new responseDto(constants.STATUS_SUCCESS, '', paymentDetailsResponses));
  } catch (e) {
    console.log(e)
    return res.json(new responseDto(constants.STATUS_FAIL, e, ''));

  }
}

let GetpaymentTransactionReport = async (req, res) => {

  try {
    //  console.log(req.query.invoiceNo)
    let paymentDetails = req.body;
    // console.log(req.body);

    let paymentDetailsResponse = await paymentsReportsDetails.Load_Payments_Reports_Details(paymentDetails);

    // console.log(paymentDetailsResponse)

    return res.json(new responseDto(constants.STATUS_SUCCESS, '', paymentDetailsResponse));
  } catch (e) {
    console.log(e)
    return res.json(new responseDto(constants.STATUS_FAIL, e, ''));

  }
}

module.exports = {
  GetpaymentTransactionListing, summary_of_payments,GetpaymentTransactionReport
}