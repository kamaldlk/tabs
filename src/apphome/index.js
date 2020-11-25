import React, { Component } from 'react';
// import { Route, Switch, Redirect, useRouteMatch, useHistory } from 'react-router-dom';
import TopNav from './topnav';
// import { Loader } from '../base/loader';
// import { ErrorBoundary } from '../base/errorboundary';
// import { Error404 } from '../404';
import { Tabs, Tab } from '../shared/componants/tabs';
import { TABITEMS } from './constant';
import styles from './appHome.module.scss';

// const TabContent = lazy(() => import('./tabcontent'));


class AppHome extends Component {
  
  constructor(props){
    super(props);
    this.state={
      tabItems: TABITEMS,
      currentTab: 'Tab1'
    }
  }
 changePage =(tab)=>{
    // history.push(tab);
    this.setState({
      currentTab:tab
    })
  };

  createNewTab=()=>{
    let { tabItems } = this.state;
    tabItems.push({
      Name:"Tab",
      path:"tabdata"
    })
    this.setState({
      tabItems
    })
  }

  removeTab=(tab, index)=>{
    let { tabItems } = this.state;
    tabItems.splice(index, 1);
    this.setState({
      tabItems
    })
  }
render() {
  let { tabItems, currentTab } = this.state;
  return (
    <div className={styles.container}>
      <TopNav/>
      <div className={styles.header}>
        <Tabs className={styles.channelTab} createNewTab={()=>this.createNewTab()} removeTab={this.removeTab}>
          {tabItems.map((tab, index) => (
            <Tab key={index} isActive={currentTab === tab.Name}
              onClick={()=>this.changePage(tab.Name + (index+1))} title={tab.Name + (index+1)}/>
          ))}
        </Tabs>
      </div>
      {/* <ErrorBoundary>
        <Suspense fallback={<Loader/>}>
          <Switch>
            <Route path={`/`}>
              <Redirect to={`/tabdata`}/>
            </Route>
            <Route path={`/tabdata`} render={()=><TabContent/>} />
            <Route path='*' render={()=><Error404/>} />
          </Switch>
        </Suspense>
      </ErrorBoundary> */}
      <div className={styles.tabContent}>
            {currentTab} content
      </div>
    </div>
  );
    }
};

export default AppHome;
