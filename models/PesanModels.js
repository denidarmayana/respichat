const {query,conn} = require('../utils/Db');

module.exports = {
	ShowUsers : async (phone)=>{
		try {
		    const results = await query(`SELECT * FROM pesan WHERE pengirim = ? OR penerima = ?`,[phone,phone]);
		    return results;
		  } catch (error) {
		    console.error('Error in JoinUsers:', error);
		    throw error;
		  }
	},
	insertPesanText : async (pengirim,penerima,text)=>{
		try {
		    const results = await query(`INSERT INTO pesan (pengirim, penerima, text) VALUES (?,?,?)`,[pengirim,penerima,text]);
		    return results;
		  } catch (error) {
		    console.error('Error in JoinUsers:', error);
		    throw error;
		  }
	},
	insertPesanTextToCS : async (pengirim,text)=>{
		let penerima
		try {
			const row = await query(`SELECT * FROM pesan WHERE pengirim = ? ORDER BY id DESC`,[pengirim]);
			if (row.length > 0) {
				penerima = row[0].penerima
			}else{
				const rows = await query(`SELECT * FROM pesan WHERE penerima = ? ORDER BY id DESC`,[pengirim]);
				if (rows.length > 0) {
					penerima = rows[0].pengirim
				}else{
					penerima = "99998888"
				}
			}
		    const results = await query(`INSERT INTO pesan (pengirim, penerima, text) VALUES (?,?,?)`,[pengirim,penerima,text]);
		    return results;
		  } catch (error) {
		    console.error('Error in JoinUsers:', error);
		    throw error;
		  }
	},
	showListUsers: async()=>{
		let hasil = [];
		try {
			const result = await query(`SELECT * FROM users WHERE level = 0`);
			if (result.length > 0) {
				await Promise.all(result.map(async (row) => {
			      const rows = await query(`SELECT * FROM pesan WHERE pengirim = ? OR penerima = ? ORDER BY id DESC`, [row.phone, row.phone]);
			      if (rows.length > 0) {
			      	  const status = await query(`SELECT * FROM pesan WHERE pengirim = ? OR penerima = ? OR TRIM(status) = '0'`, [row.phone, row.phone]);
			      	  let count = status.length * (status[0].status == 1 ? 0 : 1 ) 
				      const originalDate = new Date(rows[0].created_at);
					  const formattedTime = originalDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
				      hasil.push({ name: row.name, phone: row.phone, pesan: rows[0].text,time: formattedTime,new : count});
			      }
			      
			    }));
			}
			
		    return hasil;
		  } catch (error) {
		    console.error('Error in JoinUsers:', error);
		    throw error;
		  }
	},
	viewsMessage : async (phone)=>{
		let hasil = [];
		try {
		    const result = await query(`SELECT * FROM pesan WHERE pengirim = ? OR penerima = ?`,[phone,phone]);
		    await Promise.all(result.map(async (row) => {
		    	const originalDate = new Date(row.created_at);
			  	const formattedTime = originalDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
			  	hasil.push({ pengirim: row.pengirim, penerima: row.penerima, pesan: row.text,time: formattedTime,file: row.file});
		    }))
		    return hasil;
		  } catch (error) {
		    console.error('Error in JoinUsers:', error);
		    throw error;
		  }
	},
	nsertPesanImagesText : async (pengirim,penerima,text,file)=>{
		try {
		    const results = await query(`INSERT INTO pesan (pengirim, penerima, text,file) VALUES (?,?,?,?)`,[pengirim,penerima,text,file]);
		    return results;
		  } catch (error) {
		    console.error('Error in JoinUsers:', error);
		    throw error;
		  }
	},
	UpdatePesan : async (phone)=>{
		try {
		    const results = await query(`UPDATE pesan SET status=1 WHERE pengirim = ? OR penerima = ?`,[phone,phone]);
		    return results;
		  } catch (error) {
		    console.error('Error in JoinUsers:', error);
		    throw error;
		  }
	},
}