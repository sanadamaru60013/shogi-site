type playerrole = "white" | "black";
type komakind =
  | "FU"
  | "KY"
  | "KE"
  | "GI"
  | "KI"
  | "KA"
  | "HI"
  | "OU";
type komarole = {
  player: playerrole;
  kind: komakind;
  nari: boolean;
};
const komaDisplay={
  FU:"歩",
  KY:"香",
  KE:"桂",
  GI:"銀",
  KI:"金",
  KA:"角",
  HI:"飛",
  OU:"王"
}
import { useState } from "react";
const createFuRow = (player: playerrole): komarole[] => {
  return Array.from({ length: 9 }, () => ({
    kind: "FU",
    player,
    nari: false,
  }))
}
const createEmptyRow = (): (komarole | null)[] => {
  return Array.from({ length: 9 }, () => null);
}
const createFirstBoard = (): (komarole | null)[][] => {
  return [
    [
      { kind: "KY", player: "white", nari: false },
      { kind: "KE", player: "white", nari: false },
      { kind: "GI", player: "white", nari: false },
      { kind: "KI", player: "white", nari: false },
      { kind: "OU", player: "white", nari: false },
      { kind: "KI", player: "white", nari: false },
      { kind: "GI", player: "white", nari: false },
      { kind: "KE", player: "white", nari: false },
      { kind: "KY", player: "white", nari: false },
    ],[
      null,
      { kind: "HI", player: "white", nari: false },
      null,
      null,
      null,
      null,
      null,
      { kind: "KA", player: "white", nari: false },
      null,
    ],
    createFuRow("white"),
    createEmptyRow(),
    createEmptyRow(),
    createEmptyRow(),
    createFuRow("black"),
    [
      null,
      { kind: "KA", player: "black", nari: false },
      null,
      null,
      null,
      null,
      null,
      { kind: "HI", player: "black", nari: false },
      null,
    ],[
      { kind: "KY", player: "black", nari: false },
      { kind: "KE", player: "black", nari: false },
      { kind: "GI", player: "black", nari: false },
      { kind: "KI", player: "black", nari: false },
      { kind: "OU", player: "black", nari: false },
      { kind: "KI", player: "black", nari: false },
      { kind: "GI", player: "black", nari: false },
      { kind: "KE", player: "black", nari: false },
      { kind: "KY", player: "black", nari: false },
    ],
  ]
}
function App() {
  const [selectedKoma, setSelectedKoma] =
    useState<{ y: number; x: number } | null>(null);
  const [board, setBoard] =
    useState<(komarole | null)[][]>(
      createFirstBoard()
    );
    const movekoma = (
      previousY:number,
      previousX:number,
      currentY:number,
      currentX:number,
    )=>{
      const currentBoard=board.map((position)=>[...position])
      currentBoard[currentY][currentX]=
      currentBoard[previousY][previousX]
      currentBoard[previousY][previousX]=null
      setBoard(currentBoard)
    }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(9,50px)",
        width: "450px",
        margin: "50px auto",
      }}
    >
      {board.map((row, y) =>
        row.map((piece, x) => (
          <div
            key={`${y}-${x}`}
            onClick={() => {
              if(selectedKoma===null){
                if(piece===null){
                  return
                }
                setSelectedKoma({y,x})
                return
              }
              if(
                selectedKoma.y===y &&
                selectedKoma.x===x
              ){
                setSelectedKoma(null)
                return;
              }
              const pastKoma=
              board[selectedKoma.y][selectedKoma.x];
              if(
                piece!==null&&
                pastKoma!==null&&
                pastKoma.player===piece.player
              ){
                setSelectedKoma({y,x})
                return;
              }
              const canmoveKi=(
                koma:komarole,
                previousY:number,
                previousX:number,
                currentY:number,
                currentX:number,
              )=>{
                if((Math.abs(currentX-previousX)===1 && currentY-previousY===0) || Math.abs(currentY-previousY)===1 && currentX-previousX===0){
                  return true
                }else if(koma.player==="white" && Math.abs(currentX-previousX)===1 && currentY-previousY===1){
                  return true
                }else if(koma.player==="black" && Math.abs(currentX-previousX)===1 && currentY-previousY===-1){
                  return true
                }else{
                  return false
                }
              }
              const canmoveFu=(
                koma:komarole,
                previousY:number,
                previousX:number,
                currentY:number,
                currentX:number,
              )=>{
                if(koma.nari===false){
                if(koma.player==="white" && currentX-previousX===0 && currentY-previousY===1){
                  return true
                }
                  else if(koma.player==="black" && currentX-previousX===0 && currentY-previousY===-1){
                    return true
                  }else{
                    return false
                  }
                }else{
                  canmoveKi(koma,previousY,previousX,currentY,currentX)
                }
              }
              const canmoveKy=(
                koma:komarole,
                previousY:number,
                previousX:number,
                currentY:number,
                currentX:number,
              )=>{
                if(koma.nari===false){
                if(koma.player==="white" && currentX-previousX===0 && currentY-previousY>=1){
                  for(
                    let y =previousY+1;
                    y<currentY;
                    y=y+1
                  ){
                    if(board[y][previousX]!==null){
                      return false
                  }
                }
                return true
              }else if(koma.player==="black" && currentX-previousX===0 && currentY-previousY<=-1){
                for(
                    let y=previousY-1;
                    y>currentY;
                    y=y-1
                  ){
                    if(board[y][previousX]!==null){
                      return false
                  }
                }
                return true
              }else{
                return false
              }}else{
                canmoveKi(koma,previousY,previousX,currentY,currentX)
              }
            }
              const canmoveKe=(
                koma:komarole,
                previousY:number,
                previousX:number,
                currentY:number,
                currentX:number,
              )=>{
                if(koma.nari=false){
                if(koma.player==="white" && Math.abs(currentX-previousX)===1 && currentY-previousY===2){
                  return true
                }else if(koma.player==="black" && Math.abs(currentX-previousX)===1 && currentY-previousY===-2){
                  return true
                }else{
                  return false
                }}else{
                  canmoveKi(koma,previousY,previousX,currentY,currentX)
                }
              }
              const canmoveGi=(
                koma:komarole,
                previousY:number,
                previousX:number,
                currentY:number,
                currentX:number,
              )=>{if(koma.nari===false){
                if(Math.abs(currentX-previousX)===1 && Math.abs(currentY-previousY)===1){
                  return true
                }else if(koma.player==="white" && currentX-previousX===0 && currentY-previousY===1){
                  return true           
                }else if(koma.player==="black" && currentX-previousX===0 && currentY-previousY===-1){
                  return true
                }else{
                  return false
                }}else{
                  canmoveKi(koma,previousY,previousX,currentY,currentX)
                }
              }
              const canmoveKa=(
                koma:komarole,
                previousY:number,
                previousX:number,
                currentY:number,
                currentX:number,
              )=>{
                if(Math.abs(currentY-previousY)!==Math.abs(currentX-previousX)){
                  if(koma.nari===true && Math.abs(currentY-previousY)*Math.abs(currentX-previousX)<=1){
                    return true
                  }else{
                  return false
                }}else{
                  for(
                    let directionY=(currentY-previousY)/Math.abs(currentY-previousY),
                    y=previousY+directionY,
                    directionX=(currentX-previousX)/Math.abs(currentX-previousX),
                    x=previousX+directionX;
                    y!==currentY;
                    y+=directionY,x+=directionX
                  ){
                    if(board[y][x]!==null){
                      return false
                    }
                  }
                  return true
                }
              }
              const canmoveHi=(
                koma:komarole,
                previousY:number,
                previousX:number,
                currentY:number,
                currentX:number,
              )=>{
                if((currentY-previousY)*(currentX-previousX)!==0){
                  if(koma.nari===true && Math.abs(currentY-previousY)*Math.abs(currentX-previousX)===1){
                    return true
                  }else{
                  return false
                }
                }else if(currentY===previousY){
                  for(
                    let directionX=(currentX-previousX)/Math.abs(currentX-previousX),
                    x=previousX+directionX;
                    x!==currentX;
                    x+=directionX
                  ){
                    if(board[currentY][x]){
                      return false
                    }
                  }
                  return true
                }else{
                  for(
                    let directionY=(currentY-previousY)/Math.abs(currentY-previousY),
                    y=previousY+directionY;
                    y!==currentY;
                    y+=directionY
                  ){
                    if(board[y][currentX]){
                      return false
                    }
                  }
                  return true
                }
              }
              const canmoveOu=(
                previousY:number,
                previousX:number,
                currentY:number,
                currentX:number,
              )=>{
                if((Math.abs(currentX-previousX)<=1 && Math.abs(currentY-previousY)<=1)){
                  return true
                 }else{
                  return false
                  }
              }
              const canmove=(
                koma:komarole,
                previousY:number,
                previousX:number,
                currentY:number,
                currentX:number,
              )=>{
                switch(koma.kind){
                  case "FU":return canmoveFu(koma,previousY,previousX,currentY,currentX)
                  case "KY":return canmoveKy(koma,previousY,previousX,currentY,currentX)
                  case "KE":return canmoveKe(koma,previousY,previousX,currentY,currentX)
                  case "GI":return canmoveGi(koma,previousY,previousX,currentY,currentX)
                  case "KI":return canmoveKi(koma,previousY,previousX,currentY,currentX)
                  case "KA":return canmoveKa(koma,previousY,previousX,currentY,currentX)
                  case "HI":return canmoveHi(koma,previousY,previousX,currentY,currentX)
                  case "OU":return canmoveOu(previousY,previousX,currentY,currentX)
                }
              }
                if(pastKoma===null){
                  return
                }
            if(pastKoma.nari===false){
              if(canmove(pastKoma,selectedKoma.y,selectedKoma.x,y,x)){
              movekoma(
                selectedKoma.y,
                selectedKoma.x,
                y,
                x
              )
              if(pastKoma.nari=false){
                if(pastKoma.player==="white" && y>=7){

                }
                if(pastKoma.player==="black" && y<=3){

                }
              }
            }
            }
            if(pastKoma){}
              setSelectedKoma(null)
            }}
            style={{
              height: "50px",
              width: "50px",
              display: "flex",
              border: "2px solid black",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                selectedKoma?.y === y &&
                selectedKoma?.x === x
                  ? "yellow"
                  : "#f5d08a",
              fontSize:
                selectedKoma?.y === y &&
                selectedKoma?.x === x
                  ? "28px"
                  : "24px",
            }}
          >
            <div
            style={{
              transform:
              piece?.player==="white"
              ? "rotate(180deg)"
              : "rotate(0deg)"
              }}
              >
                {piece
                ? komaDisplay[piece.kind]
                : ""
                }
            </div>
          </div>
        ))
      )}
    </div>
  )}
export default App;