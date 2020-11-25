import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import styles from './tabs.module.scss';

export class Tab extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    isActive: PropTypes.bool,
    disabled: PropTypes.bool,
    title: PropTypes.node,
    isSelected: PropTypes.func,
    addTabTitle: PropTypes.func,
    removeTabTitle: PropTypes.func,
    setActiveTab: PropTypes.func,
    recreate: PropTypes.bool,
    classNameNext: PropTypes.string
  };

  static defaultProps = {
    recreate: true
  }

  constructor(props) {
    super(props);
    this.id = Math.random();
  }

  componentDidMount() {
    //inform the parent render title
    this.props.addTabTitle(this);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.title !== this.props.title) {
      this.props.removeTabTitle(this);
      this.props.addTabTitle(this);
    }
    if(prevProps.isActive !== this.props.isActive && this.props.isActive) {
      this.props.setActiveTab(this);
    }
  }

  componentWillUnmount() {
    this.props.removeTabTitle(this);
  }

  reuseTab() {
    let style = {
      display: this.props.isSelected(this) ? 'block' : 'none'
    };
    return (
      <div style={style} className={this.props.className}>
        {
          this.props.children
        }
      </div>
    );
  }

  reCreateTab() {
    return this.props.isSelected(this) ? (
      <div className={this.props.className}>
        {
          this.props.children
        }
      </div>
    ) : null;
  }

  render() {
    return this.props.recreate ? this.reCreateTab() : this.reuseTab();
  }
}

export class Tabs extends Component {
  static propTypes = {
    children: PropTypes.node,
    createNewTab: PropTypes.func,
    removeTab: PropTypes.func,
    className: PropTypes.string,
    wrapperClassName: PropTypes.string,
    size: PropTypes.string,
    classNameNext: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: null,
      tabContent: null,
      longTab: false,
      scrollLeftDisabled: true,
      scrollRightDisabled: false,
      tabList: []
    };
    this.onSelect = this.onSelect.bind(this);
    this.checkTabLength = this.checkTabLength.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.tabList !== this.state.tabList) {
      this.checkTabLength();
    }
  }

  isTabChild(children) {
    return React.isValidElement(children) && children.type === Tab;
  }

  addTabTitle = (tab) => {
    this.setState((state) => {
      return {
        activeTab: tab.props.isActive ? tab : state.activeTab,
        tabList: [...state.tabList, tab]
      };
    });
  }

  removeTab =(tab, index)=>{
   this.props.removeTab(tab, index);
  }

  removeTabTitle = (tabToRemove) => {
    this.setState((state) => ({
      tabList: state.tabList.filter((tab) => (tab !== tabToRemove)),
      activeTab: tabToRemove.props.isActive ? state.tabList[0] : state.activeTab
    }));
  }

  checkTabLength() {
    if(this.ulRef.scrollWidth > this.ulRef.offsetWidth) {
      this.leftMostElement = 0;
      this.rightMostElement = 0;

      let parent = this.ulRef.getBoundingClientRect();
      this.parentStart = parent.x;
      this.parentEnd = parent.x + parent.width;
      for(var i = 1; i < this.ulRef.childNodes.length; i++) {
        let node = this.ulRef.childNodes[i];
        let child = node.getBoundingClientRect();
        let childEnd = child.x + child.width;
        if (childEnd - this.parentEnd > 3) {
          this.rightMostElement = i;
          break;
        }
      }
      this.setState({
        longTab: this.ulRef.scrollWidth > this.ulRef.offsetWidth
      });
    }
  }

  onSelect(tab) {
    this.setState({
      activeTab: tab
    });
    if(tab.props.onClick) {
      tab.props.onClick();
    }
  }

  isSelected = (tab) => {
    return this.state.activeTab === tab;
  }

  moveLeft() {
    // console.log(this.ulRef.childNodes);
    for(var i = this.leftMostElement; i >= 0; i--) {
      let node = this.ulRef.childNodes[i];
      let child = node.getBoundingClientRect();
      if (this.parentStart - child.x > 3) {
        node.scrollIntoView({ block: "center", inline: "nearest" });
        this.rightMostElement = this.leftMostElement = i;
        // this.ulRef.scrollLeft = (child.x - firstElement.x);
        break;
      }
    }
    if (this.leftMostElement === 0) {
      this.setState({
        scrollLeftDisabled: true,
        scrollRightDisabled: false
      });
    } else {
      this.setState({
        scrollLeftDisabled: false,
        scrollRightDisabled: false
      });
    }
  }

  moveRight() {
    // console.log(this.ulRef.childNodes);
    for(var i = this.rightMostElement; i < this.ulRef.childNodes.length; i++) {
      let node = this.ulRef.childNodes[i];
      let child = node.getBoundingClientRect();
      let childEnd = child.x + child.width;
      if (childEnd - this.parentEnd > 3) {
        node.scrollIntoView({ block: "end", inline: "end" });
        this.rightMostElement = this.leftMostElement = i;
        // this.ulRef.scrollLeft = (childEnd - this.parentEnd) + (this.parentStart - firstElement.x);
        break;
      }
    }
    if (this.rightMostElement === this.ulRef.childNodes.length - 1) {
      this.setState({
        scrollRightDisabled: true,
        scrollLeftDisabled: false
      });
    } else {
      this.setState({
        scrollRightDisabled: false,
        scrollLeftDisabled: false
      });
    }
  }

  renderTabs(children) {
    if(this.isTabChild(children)) {
      return React.cloneElement(children, {
        addTabTitle: this.addTabTitle,
        removeTabTitle: this.removeTabTitle,
        setActiveTab: this.setActiveTab,
        isSelected: this.isSelected
      });
    }else if(React.isValidElement(children) && children.props.children) {
      let result = this.renderTabs(children.props.children);
      if(result.type === Tab) {
        return React.cloneElement(children, {}, result);
      }
      return children;
    }
    return children;
  }

  setActiveTab = (tab) => {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    return (
      <div className={`${this.props.wrapperClassName} ${styles.container}`}>
        <div className={this.props.className}>
          <div className={`${styles.tabsWrapper} ${this.props.classNameNext}`}>
            {
              this.state.longTab &&
              <div className={`${styles.iconContainer} ${styles.scroll}
                ${this.state.scrollLeftDisabled ? styles.disabled : ''}`}
              onClick={this.moveLeft}
              >
                <Isvg className={styles.scrollIcon}
                  src={require('./images/left.svg')}
                  cacheGetRequests={ true }/>
              </div>
            }
            <ul className={styles.tabs}
              ref={(ref) => (this.ulRef = ref)}>
              {
                this.state.tabList.map((tab, index) => (
                  <li key={index} className={`${styles.tabContainer} 
                  ${tab.props.disabled ? styles.disabled : ''} ${this.isSelected(tab) ? styles.active : ''}`}
                  onClick={tab.props.disabled ? (() => {}) : () => this.onSelect(tab)}
                  >
                    <div className={`${this.props.size === "small" ? `${styles.small}` : ''}
                      ${tab.props.disabled ? `${styles.placeholder}` : ''}
                      ${styles.tabContent}`}>
                      {tab.props.title}
                    </div>
                    <div className={`${this.props.size === "small" ? styles.small : ''} ${styles.line}
                        ${this.isSelected(tab) ? styles.active : ''}`}/>
                    <div className={styles.close} onClick={()=>this.removeTab(tab.props.title, index)}>
                    <Isvg className={styles.closeIcon}
                      src={require('./images/cancel.svg')}
                      cacheGetRequests={ true }/>
                    </div>
                  </li>
                ))
              }
            </ul>
            {
              this.state.longTab &&
              <div className={`${styles.iconContainer} ${styles.scroll}
                ${this.state.scrollRightDisabled ? styles.disabled : ''}`}
              onClick={this.moveRight}
              >
                <Isvg className={styles.scrollIcon}
                  src={require('./images/right.svg')}
                  cacheGetRequests={ true }/>
              </div>
            }
            {
              this.props.createNewTab &&
              <div className={`${styles.iconContainer} ${styles.add}`} onClick={this.props.createNewTab}>
                <Isvg className={styles.addIcon}
                  src={require('./images/plus.svg')}
                  cacheGetRequests={ true }/>
              </div>
            }
          </div>
        </div>
        {
          React.Children.map(this.props.children, (child) => this.renderTabs(child))
        }
      </div>
    );
  }
}
