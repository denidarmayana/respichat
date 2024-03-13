const {query,conn} = require('../utils/Db');
let result
module.exports = {
	JoinUsers : async (phone,name)=>{
		try {
		    const checkUsers = await query(`SELECT * FROM users WHERE phone = ? AND name = ? AND level = 0`,[phone, name]);

		    if (checkUsers.length === 0) {
		      const result = await query(`INSERT INTO users (phone, name) VALUES (?, ?)`,[phone, name]);
		      return result.insertId;
		    }

		    // Return the length of checkUsers
		    return checkUsers.length;
		  } catch (error) {
		    // Log the error for debugging purposes
		    console.error('Error in JoinUsers:', error);
		    throw error; // Rethrow the error to be handled by the calling function
		  }
	},
}