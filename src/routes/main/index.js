import React from "react";
import {Route, Switch} from "react-router-dom";
import Rules from "./Rules";
import Matches from "./Matches";
import Profile from "./Profile";
import Statement from "./Statement";
import ChangePassword from "./ChangePassword";
import FreeGame from "./FreeGame";
import Ledger from "./Ledger";
import Casino from "./Casino";
import IntCasino from "./IntCasino";
import Settings from "./Settings";
import Dashboard from "./Dashboard";
import MatchDetails from "./MatchDetails";
import UnsettleBets from "./UnsettleBets";
import LedgerDetails from "./LedgerDetails";
import LedgerCasinoDetails from "./LedgerCasinoDetails";
import StakeEdit from "./StakeEdit";
import IframeCasino from "./IframeCasino";
import Matka from "./Matka";
import SattaMatka from "./SattaMatka";





import Luky7ATheme2 from "./Luky7ATheme2";
import AmarAkbarAnthony from "./AmarAkbarAnthony/amarakbaranthony";
import DragonTiger20Theme2 from "./DragonTiger20Theme2/DragonTiger20theme2";
import DragonTiger202Theme2 from "./DragonTiger202Theme2/DragonTiger202Theme2";
import AndarBahar2theme2 from "./AndarBahar2Theme2/AndarBahar2theme2";
import TeenpattiT20Theme2 from "./TeenpattiT20Theme2/teenpattit20theme2";
import TeenpattiOneDayTheme2 from "./TeenpattiOneDayTheme2/TeenpattiOneDayTheme2";
import InstantWorliTheme2 from "./InstantWorliTheme2/InstantWorliTheme2";
import VirtualGames from "./VirtualGames";

import TeenpattiTESTTheme2 from "./TeenpattiTESTTheme2";
import Cards32ATheme2 from "./Cards32ATheme2";
import Cards32BTheme2 from "./Cards32BTheme2";
import CompletedMatchBets from "./CompletedMatchBets";
import InternationalLedgerDetails from "./InternationalLedgerDetails";
import MatkaNewDesgin from "./MatkaNewDesgin";
import MatkaNewDesginSingle from "./MatkaNewDesginSingle";
import MatkaNewDesginSinglePatti from "./MatkaNewDesginSinglePatti";
import MatkaNewDesginDoublePatti from "./MatkaNewDesginDoublePatti";
import MatkaNewDesginTripplePatti from "./MatkaNewDesginTripplePatti";
import MatkaNewDesginOddEven from "./MatkaNewDesginOddEven";
import MatkaNewDesginJodi from "./MatkaNewDesginJodi";
import UpDown7 from "./7UpDown";
import VirtualAndarBahar from "./VirtualAndarBahar";









const Main = ({match}) => (
<div className="">
<Switch>
    <Route path={`${match.url}/rules`} component={Rules}/>
    <Route path={`${match.url}/matches`} component={Matches}/>
    <Route path={`${match.url}/profile`} component={Profile}/>
    <Route path={`${match.url}/statement`} component={Statement}/>
    <Route path={`${match.url}/changepassword`} component={ChangePassword}/>
    <Route path={`${match.url}/freegame`} component={FreeGame}/>
    <Route path={`${match.url}/ledger`} component={Ledger}/>
    <Route path={`${match.url}/casino`} component={Casino}/>
    <Route path={`${match.url}/int-casino`} component={IntCasino}/>
    <Route path={`${match.url}/dashboard`} component={Dashboard}/>
    <Route path={`${match.url}/settings`} component={Settings}/>
    <Route path={`${match.url}/edit-stakes`} component={StakeEdit}/>
    <Route path={`${match.url}/match-deatils/:marketId?/:eventId?/:cacheUrls?`} component={MatchDetails}/>
    {/* <Route path={`${match.url}/match-deatils/:marketId?/:eventId?`} component={MatchDetails}/> */}
    <Route path={`${match.url}/pending-bets`} component={UnsettleBets}/>
    <Route path={`${match.url}/ledger-details/:marketId?`} component={LedgerDetails}/>
    <Route path={`${match.url}/ledger-casino-details/:marketId?/:ledgerType?/:date?`} component={LedgerCasinoDetails}/>
    <Route path={`${match.url}/international-ledger-casino-details/:eventId?/:ledgerType?/:date?`} component={InternationalLedgerDetails}/>
    <Route path={`${match.url}/teen20/:eventId`} component={TeenpattiT20Theme2} />
    <Route path={`${match.url}/lucky7/:eventId`} component={Luky7ATheme2} />
    <Route path={`${match.url}/aaa/:eventId`} component={AmarAkbarAnthony} />
    <Route path={`${match.url}/dt20/:eventId`} component={DragonTiger20Theme2} />
    <Route path={`${match.url}/dt202/:eventId`} component={DragonTiger202Theme2} />
    {/* <Route path={`${match.url}/ab2/:eventId`} component={AndarBahar2theme2} /> */}
    <Route path={`${match.url}/ab2/:eventId`} component={AndarBahar2theme2} />
    <Route path={`${match.url}/teen/:eventId`} component={TeenpattiOneDayTheme2} />
    <Route path={`${match.url}/worli2/:eventId`} component={InstantWorliTheme2} />
    <Route path={`${match.url}/virtual-games/:gameName?`} component={VirtualGames} />
    <Route path={`${match.url}/complted-bets/:marketId?`} component={CompletedMatchBets} />
    <Route path={`${match.url}/iframe-casino/:gameId?`} component={IframeCasino} />
    <Route path={`${match.url}/teen9/:eventId?`} component={TeenpattiTESTTheme2} />
    <Route path={`${match.url}/card32-a/:eventId?`} component={Cards32ATheme2} />
    <Route path={`${match.url}/card32eu/:eventId?`} component={Cards32BTheme2} />
    <Route path={`${match.url}/matka`} component={Matka} />
    <Route path={`${match.url}/satta-matka/:marketEvent?`} component={SattaMatka} />
    <Route path={`${match.url}/matka`} component={Matka} />
    <Route path={`${match.url}/matkanewdesgin`} component={MatkaNewDesgin} />
    <Route path={`${match.url}/matkanewdesgin-single`} component={MatkaNewDesginSingle} />
    <Route path={`${match.url}/matkanewdesgin-jodi`} component={MatkaNewDesginJodi} />
    <Route path={`${match.url}/matkanewdesgin-single-patti`} component={MatkaNewDesginSinglePatti} />
    <Route path={`${match.url}/matkanewdesgin-double-patti`} component={MatkaNewDesginDoublePatti} />
    <Route path={`${match.url}/matkanewdesgin-tripple-patti`} component={MatkaNewDesginTripplePatti} />
    <Route path={`${match.url}/matkanewdesgin-odd-even`} component={MatkaNewDesginOddEven} />
    <Route path={`${match.url}/7-up-down`} component={UpDown7} />
    <Route path={`${match.url}/v-a-b`} component={VirtualAndarBahar} />

  </Switch>
  
</div>
);

export default Main;

