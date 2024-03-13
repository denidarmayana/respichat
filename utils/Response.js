module.exports = {
	Success : async(message,data)=>{
		return {code : 200, message: message,data:data}
	},
	Error : async(message,data)=>{
		return {code : 203, message: message,data:data}
	},
}