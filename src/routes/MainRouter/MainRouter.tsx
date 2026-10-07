import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { Home } from "../../pages/Home";
import { BoardPage } from "../../pages/BoardPage";
import { NotFound } from "../../pages/NotFound";
import { useEffect } from "react";

function ScrollToTop(){
 const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function MainRouter(){
 return (
  <BrowserRouter>
   <Routes>
    <Route path="/" element={<Home />}></Route>
    <Route path="/board" element={<BoardPage />}></Route>
    <Route path="/board/:boardId" element={<BoardPage />}></Route>

    <Route path="*" element={<NotFound/>}></Route>
   </Routes>
   <ScrollToTop/>
  </BrowserRouter>
 )
}