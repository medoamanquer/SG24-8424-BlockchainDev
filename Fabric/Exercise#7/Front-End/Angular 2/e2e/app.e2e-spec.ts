import { FabricClientUiPage } from './app.po';

describe('fabric-client-ui App', function() {
  let page: FabricClientUiPage;

  beforeEach(() => {
    page = new FabricClientUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
