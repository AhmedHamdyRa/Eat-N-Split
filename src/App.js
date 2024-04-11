import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [ShowAddFriendForm, setShowAddFriendForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriendForm((show) => !show);
  }

  function handleFriendsList(newFriend) {
    setFriends((initialFriends) => [...initialFriends, newFriend]);
    setShowAddFriendForm((show) => !show);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriendForm(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onselection={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {ShowAddFriendForm && (
          <FormAddFriend onHandleFriendsList={handleFriendsList} />
        )}
        <Button onclick={handleShowAddFriend}>
          {ShowAddFriendForm ? "close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSpilitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, onselection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onselection={onselection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onselection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {friend.balance}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      )}
      {friend.balance === 0 && <p>Your and your friend are even</p>}
      <Button onclick={() => onselection(friend)}>
        {isSelected ? "close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onHandleFriendsList }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleAddFriend(e) {
    e.preventDefault();

    let id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onHandleFriendsList(newFriend);

    setImage("htps://i.pravatar.cc/48");
    setName("");
  }
  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label>👩🏻‍🤝‍👩🏻FriendName</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>💟 Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSpilitBill({ selectedFriend, onSplitBill }) {
  const [billValue, setBillValue] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = billValue ? billValue - paidByUser : "";
  const [whoIsPaid, setWhoIsPaid] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!billValue || !paidByFriend) return;
    onSplitBill(whoIsPaid === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT BIL WITH {selectedFriend.name}</h2>

      <label>💰 Bill Value</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />

      <label>👤 Your expence</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > billValue
              ? paidByUser
              : Number(e.target.value)
          )
        }
      />

      <label>👩🏽‍🤝‍👩🏻 {selectedFriend.name}'s expence</label>
      <input type="text" disabled value={paidByFriend} />

      <label>💸 who is paying the bill</label>
      <select value={whoIsPaid} onChange={(e) => setWhoIsPaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
