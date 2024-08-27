class ApiResponse extends Response {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message 
        this.success  = statusCode < 400  // ye ham khud set kr rrhe koi asia rule nhi hai
    }
}


export  { ApiResponse }