package com.Jitter.Jitter.Backend.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;

import java.io.IOException;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JWTGenerator jwtGenerator;
    @Autowired
    private CustomeUserDetailsService customeUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        
        // Allow access to public endpoints without authentication
        if (path.startsWith("/users/register") ||
            path.startsWith("/users/login") ||
            path.startsWith("/users/username") ||
            path.startsWith("/users/email") ||
            path.startsWith("/users/") && path.endsWith("/profile-picture")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = getJWTFromRequest(request);
            if (token != null) {
                if (jwtGenerator.validateToken(token)) {
                    String username = jwtGenerator.getUsernameFromJWT(token);
                    UserDetails userDetails = customeUserDetailsService.loadUserByUsername(username);
                    
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                } else {
                    throw new AuthenticationCredentialsNotFoundException("Invalid token");
                }
            } else {
                // For GET requests to user profiles, allow access without token
                if (request.getMethod().equals("GET") && path.startsWith("/users/")) {
                    filterChain.doFilter(request, response);
                    return;
                }
                throw new AuthenticationCredentialsNotFoundException("No token provided");
            }
        } catch (AuthenticationException e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
