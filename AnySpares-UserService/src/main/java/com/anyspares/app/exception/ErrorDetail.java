package com.anyspares.app.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatusCode;

@Data
@AllArgsConstructor
public class ErrorDetail {

    private HttpStatusCode httpStatusCode;
    private String message;

}
