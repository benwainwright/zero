import { mock } from "vitest-mock-extended";
import { OpenBankingTokenManager } from "./open-banking-token-manager.ts"; import { when } from "vitest-when";
import { OauthToken } from "@zero/domain";
import { buildInstance } from "@zero/test-helpers";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.setSystemTime(vi.getRealSystemTime());
});

describe("Open banking token manager", () => {
  it('creates a new token if the token is somehow empty', async () => {
    const today = new Date("2025-11-23T19:14:37.986Z");
    vi.setSystemTime(today);
    const [manager, repo,writer,,tokenFetcher] = await buildInstance(OpenBankingTokenManager);

    const mockOldToken = mock<OauthToken>({
      token: ''
    });

    when(repo.get).calledWith("foo", "open-banking").thenResolve(mockOldToken);


    when(tokenFetcher.getNewToken).calledWith().thenResolve({
      token: 'new', refreshToken: 'foo-refresh', tokenExpiresIn: 10, refreshTokenExpiresIn: 10})

    const token = await manager.getToken("foo");
    expect(tokenFetcher.getNewToken).toHaveBeenCalled()
    expect(token.refreshToken).toEqual('foo-refresh')
    expect(token.token).toEqual('new')
    expect(writer.save).toHaveBeenCalledWith(token)
  })

  it("just returns the token from the repo if it is in date", async () => {
    const today = new Date("2025-11-23T19:14:37.986Z");
    vi.setSystemTime(today);
    const [manager, repo] = await buildInstance(OpenBankingTokenManager);

    const mockToken = mock<OauthToken>();

    when(repo.get).calledWith("foo", "open-banking").thenResolve(mockToken);

    const token = await manager.getToken("foo");
    expect(token).toEqual(mockToken);
  });

  it("usinig statement does not if no events have been raised", async () => {
    const today = new Date("2025-11-23T19:14:37.986Z");
    vi.setSystemTime(today);
    const [manager, repo, writer] = await buildInstance(OpenBankingTokenManager);

    const mockToken = mock<OauthToken>();

    when(repo.get).calledWith("foo", "open-banking").thenResolve(mockToken);

    {
      await using token = await manager.getToken("foo");
      void token;
    }
    expect(writer.save).not.toHaveBeenCalled();
  });

  it("saves the returned token in the repo if an event has been raised", async () => {
    const today = new Date("2025-11-23T19:14:37.986Z");
    vi.setSystemTime(today);
    const [manager, repo, writer] = await buildInstance(OpenBankingTokenManager);

    const mockToken = mock<OauthToken>();
    when(mockToken.hasEvents).calledWith().thenReturn(true);

    when(repo.get).calledWith("foo", "open-banking").thenResolve(mockToken);

    {
      await using token = await manager.getToken("foo");
      void token;
    }
    expect(writer.save).toHaveBeenCalledWith(mockToken);
  });

  it("refreshes the token and saves it in the repo if it is out of date", async () => {
    const today = new Date("2025-11-23T19:14:37.986Z");
    vi.setSystemTime(today);
    const [manager, repo, writer, refresher] = await buildInstance(OpenBankingTokenManager);


    const mockToken = mock<OauthToken>({
      refreshToken: "refresh"
    });

    mockToken.refreshExpiry = new Date();

    when(mockToken.isOutOfDate).calledWith().thenReturn(true);
    when(repo.get).calledWith("foo", "open-banking").thenResolve(mockToken);
    when(refresher.refreshToken)
      .calledWith(mockToken)
      .thenResolve({ token: "refreshed-token", tokenExpiresIn: 10 });

    const token = await manager.getToken("foo");
    expect(mockToken.refresh).toHaveBeenCalledWith(
      "refreshed-token",
      "refresh",
      new Date(Date.now() + 10 * 1000),
      new Date()
    );
    expect(token).toEqual(mockToken);
    expect(writer.save).toHaveBeenCalledWith(mockToken);
  });
});
