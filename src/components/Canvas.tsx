import React, { useEffect, useRef } from 'react'

const Canvas = (props: { text: string, bgDir?: string, codeDir: string }) => {
  
  const canvasRef = useRef(null)
  
  useEffect(() => {
    try {
      // 1.获取canvas这个DOM节点
      const canvas: any = canvasRef.current
      //2.定义2d画布
      const ctx = canvas.getContext('2d')

      //绘制背景图片
      const img1 = new Image();
      img1.onload = () => {
        ctx.drawImage(img1, 0, 0);
        //填充文字  注意字体
        ctx.font = '30px "Microsoft YaHei"'
        ctx.fillStyle = "#ffffff";
        ctx.fillText(props.text, 170, 320);
    
        const img2 = new Image();
        img2.onload = () => {
          ctx.drawImage(img2, 150, 340);
        }
        img2.onerror = err => {
          //  throw err 
          console.log(err);
        }
        //需要注意顺序
        img2.src = props.codeDir;
      };
      img1.onerror = err => { console.log(err); }
      //需要注意顺序
      img1.src = '/bg.png';
    } catch(error) {

    }
  }, [])
  
  return <canvas ref={canvasRef} {...props} width="505" height="730" />
}

export default Canvas