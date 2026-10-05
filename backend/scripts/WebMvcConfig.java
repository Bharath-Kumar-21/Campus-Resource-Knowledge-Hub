package app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads/documents}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        registry.addResourceHandler("/uploads/documents/**")
                .addResourceLocations("file:" + uploadPath.toString() + "/");

        registry.addResourceHandler("/images/**")
                .addResourceLocations(
                        "classpath:/static/images/",
                        "file:src/main/resources/static/images/",
                        "file:D:/Technical Project/backend/src/main/resources/static/images/"
                );

        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/", "file:src/main/resources/static/css/");

        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/js/", "file:src/main/resources/static/js/");

        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}
