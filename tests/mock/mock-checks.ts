import { RoutePayload } from '../../src/server/route-handling/route-infra';
import { UserExistsErrorResponse } from '../../src/server/interface/responses/error-responses';

export class MockChecks {

    forceUserMustNotExist: 'exists' | 'not_exists' = 'not_exists';
    userMustNotExistSpy = jest.fn();

    async userMustNotExist(username: string): Promise<RoutePayload<UserExistsErrorResponse>> {
        this.userMustNotExistSpy(username);
        switch (this.forceUserMustNotExist) {
            case 'not_exists':
                return;
            case 'exists':
                return {
                    httpCode: 400,
                    consoleMessage: `Prerequisite user "${username}" must not exist failed.`,
                    payload: {
                        status: 'E_USER_EXISTS'
                    }
                };
        }
    }

}

export function mockChecks(): any {
    return new MockChecks();
}
