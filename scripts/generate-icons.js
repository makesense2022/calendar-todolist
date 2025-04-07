const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 确保目录存在
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 图标大小
const sizes = [16, 48, 128];

// 创建图标生成
async function generateIcons() {
  const svgPath = path.join(__dirname, '../public/icons/icon.svg');
  const sourceContent = fs.readFileSync(svgPath, 'utf8');
  
  ensureDir(path.join(__dirname, '../public/icons'));
  
  // 处理不同尺寸
  for (const size of sizes) {
    const outputPath = path.join(__dirname, `../public/icons/icon-${size}.png`);
    
    try {
      await sharp(Buffer.from(sourceContent))
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`生成图标: icon-${size}.png`);
    } catch (error) {
      console.error(`生成图标 icon-${size}.png 时出错:`, error);
    }
  }
}

// 执行生成
generateIcons().catch(err => {
  console.error('图标生成失败:', err);
  process.exit(1);
}); 