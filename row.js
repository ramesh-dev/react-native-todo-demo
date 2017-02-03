import React, { Component } from 'react'

import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  TextInput
} from 'react-native'

class NoteRow extends React.Component {
  render () {

    const textComp = (
      <TouchableOpacity style={styles.textWrap} onLongPress={() => this.props.onToggleEdit(true)}>
        <Text style={[styles.text, this.props.complete && styles.complete]}>{this.props.text}
        </Text>
      </TouchableOpacity>
    );

    const removeButton = (
      <TouchableOpacity onPress={this.props.onRemove}>
        <Text style={styles.destroy}>X
        </Text>
      </TouchableOpacity>
    );

    const editingComp = (
      <View style={styles.textWrap}>
        <TextInput
          onChangeText={this.props.onUpdate}
          autoFocus={true}
          value={this.props.text}
          style={styles.input}
          multiline
          />
      </View>
    );

    const doneButton = (
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => this.props.onToggleEdit(false)}>
        <Text style={styles.doneText}>Save
        </Text>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <Switch
          value={this.props.complete}
          onValueChange={this.props.onComplete}>
        </Switch>

        {this.props.editing ? editingComp : textComp}
        {this.props.editing ? doneButton : removeButton}

      </View>
    );
  }
}


const styles = StyleSheet.create({
    container : {
      padding: 10,
      flexDirection:'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    },
    textWrap: {
      flex : 1,
      marginHorizontal: 10
    },
    text: {
      fontSize :24,
      color: "#4d4d4d"
    },
    complete: {
      textDecorationLine : 'line-through'
    },
    destroy: {
      fontSize: 20,
      color : '#CC9a9a'
    },
    input : {
      height : 100,
      flex : 1,
      fontSize: 24,
      padding: 0,
      color : '#4d4d4d'
    },
    doneButton : {
      borderRadius: 5,
      borderWidth: 1,
      borderColor : '#7be290',
      padding: 7
    },
    doneText: {
      color: '#4d4d4d',
      fontSize: 20
    }
});

export default NoteRow;
