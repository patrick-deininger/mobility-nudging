import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { Rating, Button, Icon, Modal, Input, Label, Popup } from 'semantic-ui-react';
import styles from './FinishedReadingModal.scss';
import updateRatingMutation from '../../modules/core/mutations/UpdateRating';
import updateStateMutation from '../../modules/core/mutations/UpdateState';
import createBookRecommendationForFriendMutation from '../../modules/core/mutations/CreateBookRecommendationForFriend';

class FinishedReadingModal extends React.Component{

constructor(props){
  super(props);
  this.state = {
    input: {rating: 0, state:''},
    errors: [],
    modalOpen: false,
    friendEmails: [],
    friendEmail:''
  }
}

openModal = () =>   this.setState({modalOpen: true})
closeModal = () => this.setState({modalOpen: false})

addFriend = (error, data) => {
  var friendEmail = data.value;
  this.setState({...this.state, friendEmail});
}

nextFriend = () => {
  var friendEmails = this.state.friendEmails;
  var friendEmail = this.state.friendEmail;

  friendEmails[friendEmails.length] = friendEmail;
  friendEmail = '';

  this.setState({...this.state, friendEmails});
  this.setState({...this.state, friendEmail});
}

handleRatingChange = (e, data) => {
  e.preventDefault();
  const input = this.state.input;
  const inputName = 'rating'
  input[inputName] = data.rating;
  this.setState({ ...this.state, input});

}

onCompletedModal = (state) => {
  const input = this.state.input;
  input['state'] = state;
  this.setState({ ...this.state, input});

  console.log(this.state.input)
  const variables = {
    bookshelfEntryId: this.props.id,
    rating: this.state.input.rating
  }
  updateRatingMutation(this.props.relay.environment, variables, this.onCompletedUpdateRatingMutation, this.setErrors)
}

onCompletedUpdateRatingMutation = (error, data) => {

  const variables = {
    bookshelfEntryId: this.props.id,
    state: this.state.input.state
  }
 updateStateMutation(this.props.relay.environment, variables, this.onCompletedUpdateStateMutation, this.setErrors)
}

onCompletedUpdateStateMutation = (error, data) => {

  const variables = {
    hostId: this.props.userID,
    bookTitle: this.props.book.title,
    bookAuthor: this.props.book.author,
    friendEmail: "asd@fdsf.com",
    firstName: "asdsz",
    lastName: "dsfd"
  }
  createBookRecommendationForFriendMutation(this.props.relay.environment, variables, this.closeModal(), this.setErrors)
}

render(){
  const friendEmails = this.state.friendEmails;

  return(
    <div>

    <Modal size="mini" open={this.state.modalOpen} onClose={this.close}
      trigger={
        <Popup
          trigger={
              <Button icon floated="right" onClick={() => this.openModal()}>
                <Icon name="check circle" size="large"/>
              </Button>}
          content="Mark as read"
        />
      }>
      <Modal.Header>
        How did you like {this.props.book.title}?
      </Modal.Header>
      <Modal.Content>
        <div className={styles.ratingModal}>
          <Rating
            size="huge"
            defaultRating={this.props.rating}
            maxRating={5}
            id ={this.props.id}
            onRate={this.handleRatingChange}
          />
        </div>
        <div>
            <br />
            Recommend {this.props.book.title} to
            <br />
            {friendEmails.map(e => {if (e != "") { return( <Label>{e}</Label>)}})}
            <br />

          <Input id="friend"
            icon="at"
            iconPosition="left"
            placeholder="email"
            value={this.state.friendEmail}
            onChange={this.addFriend}>

          </Input>
          <Button
            icon="plus"
            type="submit"
            onClick={() => this.nextFriend()}/>

        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button basic onClick={() => this.closeModal()}>
          Close
        </Button>
        <Button positive icon='checkmark'
          content='Done'
          onClick = {() => this.onCompletedModal("read")}
        />
      </Modal.Actions>
    </Modal>
    </div>
  )
}
}

export default createFragmentContainer(
  FinishedReadingModal,
  graphql`
    fragment FinishedReadingModal_books on BookshelfEntryConnection {
    ... MyBookList_books
    }
  `);
