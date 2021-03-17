
class ResponseDto {
    constructor(status, errMessage, responseList) {
        this.status = status;
        this.errMessage = errMessage;
        this.responseList = responseList;
    }
}


module.exports = ResponseDto;