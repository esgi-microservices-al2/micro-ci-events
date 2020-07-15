using Moq;
using System;
using Xunit;

namespace ESGI.DesignPattern.Projet.Tests
{
    public class Tests
    {
        [Fact]
        public void Checkout()
        {
            Checkout checkout = new Checkout();
            Money money = new Money(10);
            Mock<IReceiptRepository> mockReceiptRepository = new Mock<IReceiptRepository>();
            ReceiptBuidler receiptBuidler = new ReceiptBuidler();
            checkout.CreateReceipt(money, mockReceiptRepository.Object, receiptBuidler);
            mockReceiptRepository.Verify(x => x.Store(It.IsAny<Receipt>()), Times.Once);
        }
    }
}

