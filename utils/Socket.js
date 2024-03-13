const {io} = require('./Server');
const fs = require('fs');
const path = require('path');
const Models = require('../models/UsersModels')
const Pesan = require('../models/PesanModels')

io.on('connection', async (socket) => {
	console.log('User connected');
	socket.on("masuk", (data)=>{
		console.log(data)
		io.emit("online",{name:data.name,client:data.client})
	})
	socket.on("updatePesan",async (data)=>{
		try{
			const updatePesan = await Pesan.UpdatePesan(data.phone)
		}catch(error){
			console.log(error)
		}
		
	})
	socket.on("typing", (data)=>{
		console.log(data)
		io.emit("typing",{client:data.client})
	})
	socket.on("tampilkanpesan" ,async (data)=>{
		try{
			const viewsMessage = await Pesan.viewsMessage(data.phone)
			socket.emit("viewPesan",viewsMessage)
		}catch(error){
			console.log(error)
		}
	})
	socket.on("connect_error", (error) => {
	  console.error("Connection error:", error);
	});
	socket.on("join", async(data)=>{
		try{
			const joinUsersResult = await Models.JoinUsers(data.phone,data.name)
			
			socket.emit("resJoin",{code:200,message:"Berhasil"})
		}catch(error){
			socket.emit("resJoin",{code:203,message:error})
		}
		
	})
	socket.on("lisrUsers", async()=>{
		try{
			const showList = await Pesan.showListUsers()
			io.emit("showListUsers",showList)
		}catch(error){
			
		}
		
	})
	socket.on("showMessage", async(data)=>{
		try{
			const Result = await Pesan.ShowUsers(data.phone)
			io.emit("MyMessage",{data:Result})
		}catch(error){
			socket.emit("MyMessage",{code:203,message:error})
		}
		
	})
	socket.on("toUser", async(data)=>{
		try{
			const Insert = await Pesan.insertPesanText(data.pengirim,data.penerima,data.text)
			const Result = await Pesan.ShowUsers(data.penerima)
			io.emit("fromCS",{penerima:data.penerima,data:Result})
			const viewsMessageFromCs  = await Pesan.viewsMessage(data.penerima)
			io.emit("fromUsers",viewsMessageFromCs)
		}catch(error){
			io.emit("fromCS",{code:203,message:error})
		}
		
	})
	socket.on("toCS", async(data)=>{
		console.log("toCS",data)
		try{
			const Insert = await Pesan.insertPesanTextToCS(data.pengirim,data.text)
			const Result = await Pesan.ShowUsers(data.pengirim)
			io.emit("fromCS",{penerima:data.pengirim,data:Result})
			const viewsMessageFromUsers  = await Pesan.viewsMessage(data.pengirim)
			io.emit("fromUsers",viewsMessageFromUsers)
			const showListNew = await Pesan.showListUsers()
			io.emit("showListUsersnew",showListNew)
		}catch(error){
			io.emit("fromCS",{code:203,message:error})
		}
		
	})
	socket.on("upload",async (data)=>{
	    try {
		    const filePath = path.join(__dirname, '../images_users', data.name);
		    const fileBuffer = Buffer.from(data.gambar, 'base64');
		    await fs.promises.writeFile(filePath, fileBuffer);
		    const insertImages = Pesan.nsertPesanImagesText(data.phone,"99998888",data.text,data.name)
		    const viewsImagesFromUsers  = await Pesan.viewsMessage(data.phone)
			io.emit("fromUsers",viewsImagesFromUsers)
			const showListImages = await Pesan.showListUsers()
			io.emit("showListUsersnew",showListImages)
			const Result = await Pesan.ShowUsers(data.phone)
			io.emit("fromCS",{penerima:data.phone,data:Result})

		} catch (err) {
		    console.error('Error writing file:', err.message);
		}
	    
	})
	socket.on("uploadCS",async (data)=>{
	    try {
		    const filePath = path.join(__dirname, '../images_cs', data.name);
		    let img = data.gambar.split(",")
		    const fileBuffer = Buffer.from(img[1], 'base64');
		    await fs.promises.writeFile(filePath, fileBuffer);
		    const insertImages = Pesan.nsertPesanImagesText("99998888",data.penerima,"",data.name)
		    const Result = await Pesan.ShowUsers(data.penerima)
			io.emit("fromCS",{penerima:data.penerima,data:Result})
			const viewsMessageFromCs  = await Pesan.viewsMessage(data.penerima)
			io.emit("fromUsers",viewsMessageFromCs)
		} catch (err) {
		    console.error('Error writing file:', err.message);
		}
	    
	})
	
})
module.exports= {io}