package com.Jitter.Jitter.Backend.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Autowired
    private JWTGenerator jwtGenerator;

    @Autowired
    private CustomeUserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            String userId = accessor.getFirstNativeHeader("X-User-ID");
            
            if (authHeader != null && authHeader.startsWith("Bearer ") && userId != null) {
                String token = authHeader.substring(7);
                
                if (jwtGenerator.validateToken(token)) {
                    String username = jwtGenerator.getUsernameFromJWT(token);
                    
                    try {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        accessor.setUser(authentication);
                    } catch (Exception e) {
                    }
                } else {
                }
            } else if (userId != null) {
                try {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    accessor.setUser(authentication);
                } catch (Exception e) {
                }
            } else {
                accessor.setUser(new UsernamePasswordAuthenticationToken("anonymous", null, null));
            }
        }
        
        return message;
    }
} 