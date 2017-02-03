import React, { Component } from 'react'

import {
  View,
  StyleSheet,
  Platform,
  ListView,
  Keyboard,
  AsyncStorage,
  ActivityIndicator
} from 'react-native'

import Header from './header'
import Footer from './footer'
import NoteRow from './row'


const filterItems = (filter, items) => {
  return items.filter((item) => {

    if (filter === 'all') return true ;
    if (filter === 'completed') return item.complete;
    if (filter === 'active') return !item.complete;
  })
}

class App extends React.Component {

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged:(r1, r2) => r1 != r2
    });

    this.state = {
        allComplete : false,
        loading: false,
        filter: "all",
        value : '',
        items: [],
        dataSource: dataSource.cloneWithRows([])
    };

    this.handleAddItem = this.handleAddItem.bind(this);
    this.setSource = this.setSource.bind(this);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleClearComplete = this.handleClearComplete.bind(this);

    this.handleUpdateText = this.handleUpdateText.bind(this);
    this.handleToggleEditing = this.handleToggleEditing.bind(this);
  }


  componentWillMount() {
    AsyncStorage.getItem('items').then((json) => {
      try{
        const items = JSON.parse(json)
        this.setSource(items, items, {loading: false});
      }catch(e){
        console.error('error fetching items',e);
        this.setState({loading: false})
      }
    })
  }

  handleAddItem() {
      if (!this.state.value) return

      const newItems = [
        ...this.state.items,
        {
          key: Date.now(),
          text: this.state.value,
          complete: false
        }
      ]

      this.setSource(newItems, filterItems(this.state.filter, newItems), {value: ''})
  }

  setSource(items, itemsDatasource, otherState = {}) {

    const ds = this.state.dataSource.cloneWithRows(itemsDatasource);

    this.setState({
      items,
      dataSource: ds,
      ...otherState
    });

    AsyncStorage.setItem('items', JSON.stringify(items));
  }

  handleFilter(filter) {
    this.setState({filter})
    this.setSource(this.state.items, filterItems(filter, this.state.items));
  }

  handleToggleComplete(key, complete) {

    const newItems = this.state.items.map((item) => {

        if (item.key != key) {
          return item;
        }

        return {
          ...item,
          complete
        }
    })

    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  handleRemoveItem(key) {
    const newItems = this.state.items.filter((item) => {
       return item.key != key
    })

    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleToggleAllComplete() {

    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => ({
      ...item,
      complete
    }));

    this.setSource(newItems, this.filterItems(this.state.filter, newItems), {allComplete : complete})
  }

  handleClearComplete() {
    const newItems = filterItems('active', this.state.items);
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleUpdateText(key, text) {
    const newItems = this.state.items.map((item) => {
      if (item.key != key) return item;
      return {
        ...item,
        text
      }
    });

    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  handleToggleEditing(key, editing) {

    const newItems = this.state.items.map((item) => {
      if (item.key != key) return item;
      return {
        ...item,
        editing
      }
    });

    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  render () {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.setState({value} )}
          onToggleAllComplete={this.handleToggleAllComplete}
          />
        <View style={styles.content}>
          <ListView style={styles.listView}
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            keyboardDismissMode="on-drag"
            renderSeparator={(sectionId, rowId) => {
              return <View key={rowId} style={styles.seperator}/>
            }}
            renderRow={this.renderRow}
            />
        </View>
        <Footer count={filterItems('active', this.state.items).length}
                filter={this.state.filter}
                onFilter={this.handleFilter}
                onClearComplete={this.handleClearComplete}/>
              {this.state.loading && <View style={styles.loading}>
                <ActivityIndicator animating size="large"/>
              </View>}
      </View>
    );
  }


  renderRow = ({key, ...value}) => {
    return (
      <NoteRow key={key} {...value}
        onUpdate = {(text) => this.handleUpdateText(key, text)}
        onToggleEdit={(editing) => this.handleToggleEditing(key, editing)}
        onComplete={(complete) => this.handleToggleComplete(key, complete)}
        onRemove={() => this.handleRemoveItem(key)}/>
    );
  }

}// end app

export default App;

const styles =  StyleSheet.create({

  container : {
    flex : 1,
    backgroundColor : '#F5F5F5',
    ...Platform.select({
      ios: {
        paddingTop: 30
       }
    })
  },
  content : {
    flex :1
  },
  listView: {
    backgroundColor: '#FFF',

  },
  seperator : {
    borderWidth :1,
    borderColor : "#F5F5F5"
  },
  loading: {
    position: "absolute",
    top :0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
});
