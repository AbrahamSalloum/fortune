import React from 'react';
import { DiscussionEmbed } from 'disqus-react';

const ChatBox = ({ticker}) => {
    return (
        <div>
            <DiscussionEmbed
                shortname='track-dollarmoat-com'
                config={{
                    url: window.location.href,
                    identifier: ticker,
                    title: ticker,
                    language: 'en_GB'	
                }}
            />
        </div>
    )
}

export default ChatBox