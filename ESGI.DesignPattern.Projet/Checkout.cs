using System;
using System.Collections.Generic;
using System.Text;

namespace ESGI.DesignPattern.Projet
{
    public class Checkout
    {
      

        public Receipt CreateReceipt(Money amount, IReceiptRepository receiptRepository, ReceiptBuidler receiptBuidler)
        {
            Receipt receipt = receiptBuidler
                .withAmount(amount)
                .withTax(20)
                .build();

            receiptRepository.Store(receipt);

            return receipt;
        }
    }
}
