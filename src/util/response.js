class Response {
    constructor(){
        this.httpCode = null;
        this.data = null;
        this.error = null;
    }

    created(data){
        this.httpCode = 201;
        this.data = data;
        return this;
    }

    ok(data){
        this.httpCode = 200;
        this.data = data;
        return this;
    }

    badRequest(error){
        this.httpCode = 400;
        this.error = this.formatError(error)
        return this;
    }

    notFound(error){
        this.httpCode = 404;
        this.error = this.formatError(error)
        return this;
    }

    internalServerError(error){
        this.httpCode = 500;
        this.error = this.formatError(error)
        console.log(this.error)
        return this;
    }

    formatError(error){
        if(error instanceof Error){
            return error.message;
        }
        return error
    }
}

module.exports = Response