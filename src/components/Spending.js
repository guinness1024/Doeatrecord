import React from "react";
import {convertMoney} from "../_common/utils";
import {gql} from "apollo-boost";
import {useQuery} from "@apollo/react-hooks";
import Emoji from "react-emoji-render";
import Error from "./Error";
import "./Spending.scss";

const now = new Date();

const GET_SPENDING = gql`
  query Spending($userId: String!, $now: Date) {
    spending(userId: $userId, now: $now) {
      total
      dutch
    }
  }
`;

const Spending = ({userId}) => {
  
  const {loading, error, data} = useQuery(GET_SPENDING, {
    variables: {
      userId, now
    }
  });
  
  if (loading) return null;
  if (error) return <Error message={error.toString()}/>;
  
  const {spending: {total, dutch}} = data;
  
  return (
    <article className="spending">
      <div className="spending-field">
        이번 달 <strong className="spending-strong">{convertMoney(total)}원</strong> 썼다!
        <Emoji text=" :money_with_wings:"/>
        <Emoji text=":money_with_wings:"/>
        <Emoji text=":money_with_wings:"/>
      </div>
      <div className="spending-field">
        커플<Emoji text=":woman-heart-man:"/>이라면 한 명당
        <strong className="spending-strong"> {convertMoney(dutch)}원 </strong>
        씩 더치페이!
      </div>
    </article>
  );
};

export default Spending;