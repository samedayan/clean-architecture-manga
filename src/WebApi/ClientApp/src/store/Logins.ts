import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface LoginState {
    isLoading: boolean;
    login: Login;
}

export interface Login {
    name: string;
}

interface RequestLoginAction {
    type: 'REQUEST_LOGIN';
}

interface ReceiveLoginAction {
    type: 'RECEIVE_LOGIN';
    login: Login;
}


type KnownAction = RequestLoginAction | ReceiveLoginAction;

export const actionCreators = {
    requestLogin: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.login) {
            fetch(`/api/v1/Login/GetUserInfo`)
                .then(response => response.json() as Promise<Login>)
                .then(login => {
                    dispatch({ type: 'RECEIVE_LOGIN', login: login });
                });

            dispatch({ type: 'REQUEST_LOGIN' });
        }
    }
};

const unloadedState: LoginState = { login: { name }, isLoading: false };

export const reducer: Reducer<LoginState> = (state: LoginState | undefined, incomingAction: Action): LoginState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_LOGIN':
            return {
                login: state.login,
                isLoading: true
            };
        case 'RECEIVE_LOGIN':
            if (action.login === state.login) {
                return {
                    isLoading: false,
                    login: action.login
                };
            }
            break;
    }

    return state;
};
