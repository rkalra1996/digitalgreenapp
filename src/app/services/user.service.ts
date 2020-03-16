// tslint:disable: no-string-literal
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from 'rxjs';
import { QuestionsService } from './questions/questions.service';

export interface IUser {
  username: string;
  password: string;
  role: string;
  topics: Array<string>;
  questions: Array<string>;
  sessionToken: string;
}
@Injectable({
  providedIn: "root"
})
export class UserService {
  private masterToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJpc2hhYmhrYWxyYTk2IiwiZW1haWwiOiJyaXNoYWJoa2FscmE5NkBnbWFpbC5jb20iLCJpYXQiOjE1ODA4ODI1Nzl9.dxrWrjX3jaUe4t33Y9H0oLdSxenSaJA-EYaCNHIk8Ys";
  private userlist = [
    {
      username: "sumit",
      password: "sumit",
      role: "block_officer",
      topics: ["कीटनाशक नियंत्रण", "कृषि नीतियां", "फसल कटाई", "दूध उत्पादन"],
      questions: [
        {
          topic_id: "1",
          isPlayed: false,
          topic_title: 'कृषि',
          topic_name: "किसानों को किन शीर्ष चुनौतियों का सामना करना पड़ रहा है?",
          status: false
        },
        {
          topic_id: "2",
          isPlayed: false,
          topic_title: 'कृषि',
          topic_name: "किस प्रकार के समाधान आपकी सहायता कर सकते हैं?",
          status: false
        },
        {
          topic_id: "3",
          isPlayed: false,
          topic_title: 'स्वास्थ्य',
          topic_name: "किसानों को किन शीर्ष स्वास्थ्य चुनौतियों का सामना करना पड़ रहा है?",
          status: false
        },
        {
          topic_id: "4",
          isPlayed: false,
          topic_title: 'स्वास्थ्य',
          topic_name: "किस प्रकार के समाधान आपकी सहायता कर सकते हैं?",
          status: false
        }
      ],
      sessiontoken: ""
    },
    {
      username: "deepak",
      password: "deepak",
      role: "mrp",
      topics: ["जल संचयन", "फसल की खेती", "कृषि नीतियां"],
      questions: [
        {
          topic_id: "1",
          topic_name: "प्रक्रिया में क्या सुधार करने की आवश्यकता है?",
          isPlayed: false,
          status: false
        },
        {
          topic_id: "2",
          topic_name: "किसानों द्वारा सामना किए गए शीर्ष चुनौतियां क्या हैं?",
          isPlayed: false,
          status: false
        },
        {
          topic_id: "3",
          topic_name: "वीआरपी के सामने जमीनी स्तर की चुनौतियां क्या हैं?",
          isPlayed: false,
          status: false
        }
      ],
      sessiontoken: ""
    },
    {
      username: "rishabh",
      password: "rishabh",
      role: "vrp",
      topics: ["कृषि", "स्वास्थ्य"],
      questions: [
        {
          topic_id: "1",
          topic_name: "वीडियो और प्रसार प्रक्रिया में क्या सुधार करने की आवश्यकता है?",
          isPlayed: false,
          status: false
        },
        {
          topic_id: "2",
          topic_name: "आप और क्या सीखना चाहते हैं?",
          isPlayed: false,
          status: false
        },
        {
          topic_id: "3",
          topic_name: "आज के दौर में आपको किन चुनौतियों का सामना करना पड़ता है?",
          isPlayed: false,
          status: false
        },
        {
          topic_id: "4",
          topic_name: "ऐसे कौन से उपाय हैं जो आपकी मदद कर सकते हैं?",
          isPlayed: false,
          status: false
        }
      ],
      sessiontoken: ""
    },
  ];

  users: any;
  loggedInUser = null;
  public userDetailsObs = new BehaviorSubject<object|null>(null);

  constructor(
    private storage: Storage,
    private questionsSrvc: QuestionsService,
    ) {}

  async validateUserDetails(username, password) {
    const localUsers = await this.getUserList();
    const users = localUsers['users'] || [];
    let userdetails;
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.username.toLowerCase() === username.toLowerCase().trim() && user.password === password) {
        userdetails = { ...user };
        userdetails["sessiontoken"] = this.getMasterToken();
        const status = await this.setLoggedInUser(userdetails);
        if (status) {
          return 1;
        } else {
          return -10;
        }
      } else if (user.username === username.trim()) {
        return 0;
      }
    }
    return -1;
  }

  async getUserTopics(lang?: string) {
    const user = await this.getLoggedInUser();
    if (!!user) {
      if (lang && lang !== 'hi') {
        return user['topics'][lang];
      } else {
        // if no language is sent or hi is sent, return with hindi array
        return user['topics']['hi'];
      }
    }
  }

  async getUserQuestions() {
    const user = await this.getLoggedInUser();
    if (!!user) {
      return user["questions"];
    } else {
      return [];
    }
  }

  async setLoggedInUser(userdetails) {
    const loggedinuser = await this.storage.set(
      "loggedinuser",
      JSON.stringify(userdetails)
    );
    this.loggedInUser = userdetails;
    return loggedinuser;
  }

  async getLoggedInUser() {
    if (!this.loggedInUser) {
      const loggedinuser = await this.storage.get("loggedinuser");
      this.loggedInUser = JSON.parse(loggedinuser);
    }
    // emit the userdetails as observable as well
    this.userDetailsObs.next(this.loggedInUser);
    return this.loggedInUser;
  }

  getMasterToken() {
    return this.masterToken;
  }

  endSession() {
    this.storage.remove("loggedinuser");
  }

  async getUserList() {
    // return [...this.userlist];
    const users = await this.storage.get('users');
    if (users && users.length) {
      return JSON.parse(users);
    } else {
      return [];
    }
  }

  async getUserRole() {
    const user = await this.getLoggedInUser();
    if (!!user) {
      return user["role"];
    } else {
      return null;
    }
  }

  clearUserData() {
    this.users = [];
    this.loggedInUser = null;
  }

   async getUserListFromLocalDB() {
    const localDBUsers = await this.storage.get('users');
    if (localDBUsers) {
      return Promise.resolve(JSON.parse(localDBUsers));
    } else {
      return Promise.resolve({users: []});
    }
  }

  async setUsers(usersArray) {
    const isSet = await this.storage.set('users', JSON.stringify(usersArray));
    return Promise.resolve(isSet);
  }

  async updateUsers(updatedUsersArray) {
    const localUsers = await this.getUserListFromLocalDB();
    if (localUsers) {
      // merge the users
      const newUpdatedUsers = this.mergeUsers(updatedUsersArray, localUsers['users']);
      // assign proper questions to the user Objects if they don't have it
      const newUpdatedUsersWithQuestions = this.syncQuestions(newUpdatedUsers, localUsers);
      const newUpdatedUsersWithQuesAndTopics = this.questionsSrvc.syncTopics(newUpdatedUsersWithQuestions);
      // console.log('final users array to set in local db looks like ', newUpdatedUsersWithQuestions);
      const isSet = await this.setUsers(newUpdatedUsersWithQuesAndTopics);
      // console.log('is properly set ?', isSet);
      return Promise.resolve({ok: true});
    } else {
      console.log('users not available in local db to update');
      return Promise.reject({ok: false, error: 'users not available in local db to update'});
    }
  }

  mergeUsers(newUsers, oldUsers) {
    console.log('new users are ', newUsers);
    console.log('old users are ', oldUsers);
    const mergedUsers = [];
    newUsers.forEach(user => {
      const existingLocalIdx = oldUsers.findIndex(localUser => {
        return (localUser['username'].toLowerCase() === user['username'].toLowerCase())
      });
      if (existingLocalIdx > -1) {
        // to make sure we also retain the old topics
        mergedUsers.push({...oldUsers[existingLocalIdx], ...user, topics: oldUsers[existingLocalIdx]['topics']});
      } else {
        // new user, add it in the updatedlist
        mergedUsers.push(user);
      }
    });
    // clean the old users which no longer exist in the remote db as well
    const updatedUsers = this.cleanObsoleteUsers(mergedUsers, newUsers);
    // console.log('final merged users look like ', updatedUsers);
    return {users: updatedUsers};
  }

  /**
   * Cleans obsolete users. The purpose is to remove those users from the app whose details are no longer available in the remote db
   * @param mergedUsers 
   * @param remoteUsers 
   */
  cleanObsoleteUsers(mergedUsers, remoteUsers) {
    const cleanedUsers = mergedUsers.filter(user => {
      return (remoteUsers.findIndex(remoteUser => remoteUser['username'].toLowerCase() === user['username'].toLowerCase()) > -1)
    });
    return cleanedUsers;
  }

  syncQuestions(totalUsers, oldUsers) {
  // to make sure that users who have attempted there questions, they are not lost
  totalUsers.users.forEach((newUser) => {
    if (!newUser.hasOwnProperty('questions')) {
      // it is a first time user, assign default questions object to it
      newUser['questions'] = this.questionsSrvc.getDefaultQuestions(newUser['role']);
    } else {
      const matchedOldIdx = oldUsers['users'].findIndex(oldUser => oldUser['username'].toLowerCase() === newUser['username'].toLowerCase());
      // tslint:disable-next-line: max-line-length
      const mergedQuestions = this.questionsSrvc.updateQuestions(oldUsers['users'][matchedOldIdx]['questions'], oldUsers['users'][matchedOldIdx]['role'])
      newUser['questions'] = mergedQuestions;
    }
});
  return totalUsers;
  }
}
