import { CarlyTemplatePage } from './app.po';

describe('Carly App', function() {
  let page: CarlyTemplatePage;

  beforeEach(() => {
    page = new CarlyTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
