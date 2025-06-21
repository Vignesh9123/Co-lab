"use client";
import { Tldraw, TLShapeId } from 'tldraw'
import 'tldraw/tldraw.css'
import { useTheme } from 'next-themes';
import { useSocketStore } from '@/zustand/socket';
import { useEffect } from 'react';
import { useAuthStore } from '@/zustand/auth';
import HandleChange from '@/components/HandleChange';

export default function App() {
    
	return (
    <div className='relative w-full h-full '>

		<div style={{ position: 'absolute', inset: 0 }}>
			<Tldraw 
        inferDarkMode={useTheme().theme == "dark"}
        onMount={(editor)=>{
          editor.createShape({
            "x": 265.20000076293945,
            "y": 137.8000060915947,
            "rotation": 0,
            "isLocked": false,
            "opacity": 1,
            "meta": {fromServer: true},
            id: "shape:Y72b7CUV_Sj48n9xZ7Xzk" as TLShapeId,
            "type": "geo",
            "props": {
              "w": 550.4000244140625,
              "h": 272.79998779296875,
                "geo": "rectangle",
                "color": "black",
                "labelColor": "black",
                "fill": "none",
                "dash": "draw",
                "size": "m",
                "font": "draw",
                "align": "middle",
                "verticalAlign": "middle",
                "growY": 0,
                "url": "",
                "scale": 1,
                "richText": {
                    "type": "doc",
                    "content": [
                      {
                            "type": "paragraph"
                        }
                      ]
                    }
                  },
                  "typeName": "shape",
                  //@ts-ignore
                  
            // "parentId": "page:page",
            // "index": "a2AqY"
        })
        }}
      >
        <HandleChange/>

      </Tldraw>
		</div>
    </div>
	)
}