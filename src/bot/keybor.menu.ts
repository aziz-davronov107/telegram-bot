export const keyboard = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: "Info"
                },
                {
                    text: "help"
                },
            ],
            [
                {
                    text: "sertificate"
                }
            ]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
}

export const subscripions = {
    reply_markup: {
    inline_keyboard: [[
      { text: 'Kanalga o‘tish', url: 'https://t.me/monta_history' }
    ],[
      { text: '✅ A’zo boldim', callback_data: 'check_subscription' }
    ]]
  }
}

export const country = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: "Sirdaryo",
                    callback_data: "sirdaryo"
                }
            ],
            [
                {
                    text: "Farg'ona",
                    callback_data: "farg'gona"
                }
            ]
        ],
    }            
}

export const contact = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: "Contact yuborish",
                    request_contact: true
                }
            ]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
}