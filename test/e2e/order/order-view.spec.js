var OrderViewPage = require('../page-objects/order-view-page');

describe('order view', function() {

    var page;
    var EC = protractor.ExpectedConditions;

    beforeEach(function() {
        page = new OrderViewPage();
        page.open();
    });

    /*it('should show a proper heading', function() {
     expect(page.getHeading().getText()).toBe('Orders');
     });*/

    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor

    it('should open cancel order modal, close it on click on cancel button or go to startscreen page on click on reverse button', function() {

        // Cancel Order Modal opened

        var cancelOrderBtn = page.getCancelOrder();
        var cancelCancelOrderBtn = page.getCancelCancelOrder();
        var reverseBtn = page.getReverseOrder();
        expect(cancelOrderBtn.isPresent);

        cancelOrderBtn.isDisplayed().then(function(visible) {
            if (visible) {
                cancelOrderBtn.click();
                expect(browser.wait(EC.visibilityOf($('.cancel-order')), baseConfig.shortWaitTimeout));

                expect(cancelCancelOrderBtn.isPresent);

                cancelCancelOrderBtn.isDisplayed().then(function(visible) {
                    if (visible) {
                        cancelCancelOrderBtn.click();
                        expect(browser.wait(EC.inVisibilityOf($('.cancel-order')), baseConfig.shortWaitTimeout));
                    }
                })

                expect(reverseBtn.isPresent);

                reverseBtn.isDisplayed().then(function(visible) {
                    if (visible) {
                        reverseBtn.click();
                        expect(browser.getCurrentUrl()).toContain('#/app/home');
                    }
                })
            }
        })

    });

    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor END


    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor

    it('should open a modal with QR code and close it on click on close button', function() {

        // Open QR Code Modal

        var qrShowBtn = page.getShowQr();
        var qrBackBtn = page.getQrBack();
        expect(qrShowBtn.isPresent);

        qrShowBtn.isDisplayed().then(function(visible) {
            if (visible) {
                qrShowBtn.click();
                expect(browser.wait(EC.visibilityOf($('.qr-code')), baseConfig.shortWaitTimeout));

                expect(qrBackBtn.isPresent);

                qrBackBtn.isDisplayed().then(function(visible) {
                    if (visible) {
                        qrBackBtn.click();
                        expect(browser.wait(EC.inVisibilityOf($('.qr-code')), baseConfig.shortWaitTimeout));
                    }
                })
            }
        })

    });

    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor END



    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor

    it('should open/close a modal with messages and go to updated order-view page', function() {

        // Message Modal opened

        var messageBtn = page.getMessage();
        var messageCancelBtn = page.getMessageCancel();
        var confirmMessageBtn = page.getMessageConfirm();
        expect(messageBtn.isPresent);

        messageBtn.isDisplayed().then(function(visible) {
            if (visible) {
                messageBtn.click();
                expect(browser.wait(EC.visibilityOf($('.message')), baseConfig.shortWaitTimeout));

                expect(messageCancelBtn.isPresent);

                messageCancelBtn.isDisplayed().then(function(visible) {
                    if (visible) {
                        messageCancelBtn.click();
                        expect(browser.wait(EC.inVisibilityOf($('.message')), baseConfig.shortWaitTimeout));
                    }
                })

                expect(confirmMessageBtn.isPresent);

                confirmMessageBtn.isDisplayed().then(function(visible) {
                    if (visible) {
                        confirmMessageBtn.click();
                        expect(browser.getCurrentUrl()).toContain('#/app/order-view');
                    }
                })
            }
        })

    });

    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor END

});