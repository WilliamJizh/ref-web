"use client"

import { ImageNodeData } from "@/types/types";
import { NodeResizer } from "@xyflow/react";
import Image from "next/image";
import { useRef, useState } from "react";

function ImageNode({ data, selected }: { data: ImageNodeData; selected?: boolean }) {
  const [width, setWidth] = useState(data.width); // Initial width
  const [height, setHeight] = useState(data.height); // Initial height
  const nodeRef = useRef(null);


  return (
    <>
      <div>
        <NodeResizer
          keepAspectRatio={true}
          isVisible={selected}
          handleStyle={{
            opacity: 0,
            padding: "20px",
          }}
          lineStyle={{
            border: "none",
            padding: "20px",
          }}
          minWidth={100}
          minHeight={100}
          onResizeEnd={(data) => {
            setWidth(data.subject.x);
            setHeight(data.subject.y);
          }}
        />
        <div>
          <Image
            ref={nodeRef}
            src={data.image}
            alt="image"
            width={width}
            height={height}
            className="w-full h-full"
          />
        </div>
        {/* <div className="flex flex-row gap-2">
          {data && data.colors?.map((color:{hex:string}) => {
            return (
              <div key={color.hex} className={'w-4 h-4'}  style={{backgroundColor: color.hex}} />
            );
          })}
        </div> */}
      </div>
    </>
  );
}

export default ImageNode;
