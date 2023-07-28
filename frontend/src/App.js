import styles from './App.module.css';
import NavBar from './components/NavBar';
import { Container } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm'
import SignInForm from './pages/auth/SignInForm';
import TaskCreateForm from './pages/tasks/TaskCreateForm';
import TaskList from './pages/tasks/TaskList';
import TaskPage from './pages/tasks/TaskPage';
import { useCurrentUser } from './contexts/CurrentUserContext';
import TaskEditForm from './pages/tasks/TaskEditForm';
import ProfilePage from './pages/profiles/ProfilePage';
import ProfileList from './pages/profiles/ProfileList';
import CategoryList from './pages/categories/CategoryList';
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from './pages/profiles/UserPasswordForm';
import ProfileEditForm from './pages/profiles/ProfileEditForm';
import NotFound from './components/NotFound';
import CategoryPage from './pages/categories/CategoryPage';


function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
        <Container className={styles.Main}>
          <Switch>
            <Route
              exact
              path="/"
              render={() => <SignInForm />}
            />
            <Route
              exact
              path="/mytasks"
              render={() => (
                <TaskList
                  message="No results found. Adjust your search keyword."
                  filter={`tasks__owner__profile=${profile_id}&assigned_to=${profile_id}`}
                />
              )}
            />
            <Route exact path="/signin" render={() => <SignInForm />} />
            <Route exact path="/register" render={() => <SignUpForm />} />
            <Route exact path="/tasks/create" render={() => <TaskCreateForm />} />
            <Route exact path="/tasks/:id/edit" render={() => <TaskEditForm />} />
            <Route exact path="/tasks/:id" render={() => <TaskPage />} />
            <Route exact path="/tasks/" render={() => <TaskList />} />
            <Route exact path="/profiles/" render={() => <ProfileList />} />
            <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
            <Route exact path="/categories/" render={() => <CategoryList />} />
            <Route exact path="/categories/:id" render={() => <CategoryPage />} />
            <Route
              exact
              path="/profiles/:id/edit/username"
              render={() => <UsernameForm />}
            />
            <Route
              exact
              path="/profiles/:id/edit/password"
              render={() => <UserPasswordForm />}
            />
            <Route
              exact
              path="/profiles/:id/edit"
              render={() => <ProfileEditForm />}
            />
            <Route render={() => <NotFound />} />
          </Switch>
        </Container>
    </div>
  );
}

export default App;