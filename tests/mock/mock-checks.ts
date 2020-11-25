import { RoutePayload } from 'server/route-handling/route-infra';
import { RegisterUserExistsErrorResponse } from 'interface/responses/auth-endpoints';

export class MockChecks {

    forceUserMustNotExist: 'exists' | 'not_exists' = 'not_exists';
    userMustNotExistSpy = jest.fn();

    async userMustNotExist(username: string): Promise<RoutePayload<RegisterUserExistsErrorResponse>> {
        this.userMustNotExistSpy(username);
        switch (this.forceUserMustNotExist) {
            case 'not_exists':
                return;
            case 'exists':
                return {
                    httpCode: 400,
                    consoleMessage: `Prerequisite user "${username}" must not exist failed.`,
                    payload: {
                        error: 'User Already Exists',
                        ok: false
                    }
                };
        }
    }

}

export function mockChecks(): any {
    return new MockChecks();
}
