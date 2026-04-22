package com.anyspares.app.exception;

import com.anyspares.app.constants.Constants;
import com.anyspares.app.payload.response.CommonResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<CommonResponse> handleAuthException(AuthException authException,
                                                              HttpServletRequest httpServletRequest) {
        ErrorDetail error = null;
        CommonResponse response = new CommonResponse(
                Constants.FAILURE,
                "",
                List.of(""),
                List.of(error)
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }


}
