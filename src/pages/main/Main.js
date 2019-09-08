import React, {Fragment, useContext} from "react";
import {Redirect, Route} from "react-router-dom";
import {SearchListContext} from "../../contexts/SearchListContext";
import {getMe} from "../../_common/utils";
import Header from "./Header";
import Search from "../../organisms/search/Search";
import Record from "../../organisms/record/Record";
import Diary from "../../organisms/diary/Diary";
import Me from "../../organisms/auth/Me";
import Nav from "./Nav";
import Footer from "./Footer";
import SearchList from "../../organisms/search/SearchList";
import "./Main.scss";

const Main = ({history, match: {url}}) => {
  
  const {token} = getMe();
  if (!token) {
    alert('로그인 해주세요!');
    history.push('/login');
  }
  
  const {state: {isShowList}} = useContext(SearchListContext);
  
  const viewDetail = placeId => history.push(`/main/record/${placeId}`);
  
  return (
    <Fragment>
      <Header/>
      <Route exact path={`${url}`} render={() => <Redirect to={`${url}/search`}/>}/>
      <Route path={`${url}/search`} component={Search}/>
      <Route path={`${url}/record/:placeId`} component={Record}/>
      <Route path={`${url}/diary`} component={Diary}/>
      <Route path={`${url}/me`} component={Me}/>
      {
        isShowList ? <SearchList viewDetail={viewDetail}/> : <Nav/>
      }
      <Footer/>
    </Fragment>
  );
};

export default Main;