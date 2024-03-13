
const Utils = require('./utils');
const useragent = require('useragent');
const path = require('path');

Utils.Server.app.use(Utils.Server.express.static('public'));

Utils.Server.dotenv.config();

const PORT = process.env.PORT || 3000;
Utils.Server.app.set('view engine', 'ejs');
Utils.Server.app.use('/assets', Utils.Server.express.static('./views/assets'));
Utils.Server.app.use('/images_users', Utils.Server.express.static(path.join(__dirname, 'images_users')));
Utils.Server.app.use('/images_cs', Utils.Server.express.static(path.join(__dirname, 'images_cs')));

Utils.Server.app.get("/", async (req,res)=>{
  const userAgentString = req.headers['user-agent'];
  const agent = useragent.parse(userAgentString);
  const isMobile = agent.family.toLowerCase().includes('mobile');
  
  if (isMobile) {
    res.render("cs_mobile")  
  }else{
    res.render("cs_desktop")
  }
  
})

Utils.Server.server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
