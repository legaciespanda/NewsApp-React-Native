import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ListView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableHighlight
} from "react-native";
import * as appConst from "../../src/config/Config";
import FeedView from '../screens/FeedView';

var feed = [];
export default class NewsFeed extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows(feed),
      isLoading: false
    };
  }

  async componentWillMount() {
    fetch(appConst.NEWS_TEST_URL)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(
            responseJson.articles
          ),
          isLoading: true
        });
      })
      .catch(error => {
        console.log("reset client error-------", error);
      });
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={rowData => (
              <View style={styles.listitem}>
                <TouchableHighlight onPress={
                  ()=>{
                    this.props.navigator.navigate({
                      component: FeedView,
                      props: { title:rowData.title }
                    });
                  }
                }>
                  <View style={styles.feedItem}>
                    <View style={{ flexDirection: "column", flex: 0.7 }}>
                      <Text style={styles.authorName}>{rowData.author}</Text>
                      <Text style={styles.title}>{rowData.title}</Text>
                      <Text style={styles.publishedAt}>
                        {rowData.publishedAt}
                      </Text>
                    </View>
                    <Image
                      source={{ uri: rowData.urlToImage }}
                      style={{
                        flex: 0.3,
                        padding: 10,
                        width: 100,
                        height: 100
                      }}
                    />
                  </View>
                </TouchableHighlight>
              </View>
            )}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  listitem: {
    borderWidth: 1,
    borderRadius: 1,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 5,
    backgroundColor: "#ffffff"
  },
  feedItem: {
    flex: 1,
    flexDirection: "row"
  },
  authorName: {
    padding: 5,
    color: "#90a4a8",
    fontSize: 13
  },
  title: {
    paddingRight: 5,
    paddingLeft: 5,
    color: "#41676d",
    fontSize: 16
  },
  publishedAt: {
    padding: 12,
    color: "#19cbea",
    fontSize: 10
  }
});