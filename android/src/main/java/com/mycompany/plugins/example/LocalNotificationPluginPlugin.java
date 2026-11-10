package com.mycompany.plugins.example;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;

import androidx.annotation.RequiresPermission;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;


import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(name = "LocalNotificationPlugin",
permissions = {
                @Permission(
                    alias = "notifications",
                    strings = {
                        Manifest.permission.POST_NOTIFICATIONS,
          }
                )
            }
)
public class LocalNotificationPluginPlugin extends Plugin {

    private LocalNotificationPlugin implementation = new LocalNotificationPlugin();


    private static final String CHANNEL_ID = "default_notifications";
    private NotificationManager notificationManager;
    @Override
    public void load() {
        super.load();
        this.notificationManager =
                (NotificationManager) getContext()
                        .getSystemService(Context.NOTIFICATION_SERVICE);

        createNotificationChannel();
    }

    private void createNotificationChannel() {

        Context context = getContext();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            CharSequence name = "Default Notifications";
            String description = "Application notifications";

            int importance = NotificationManager.IMPORTANCE_DEFAULT;

            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    name,
                    importance
            );

            channel.setDescription(description);

//            NotificationManager manager =
//                    context.getSystemService(NotificationManager.class);

            this.notificationManager.createNotificationChannel(channel);
        }
    }

    @PluginMethod
    @RequiresPermission("android.permission.POST_NOTIFICATIONS")
    public void notify(PluginCall call) {

        if (getPermissionState("notifications") != PermissionState.GRANTED) {
            requestPermissionForAlias("notifications", call, "displayNotification");
        } else {
            displayNotification(call);
        }

    }

    @PermissionCallback
    @RequiresPermission("android.permission.POST_NOTIFICATIONS")
    public void displayNotification(PluginCall call){
        Context context = getContext();

        String title = call.getString("title", "Notification");
        String body = call.getString("body", "Hello from Capacitor!");

        Notification notification =
                new NotificationCompat.Builder(context, CHANNEL_ID)
                        .setSmallIcon(R.drawable.ic_notification)
                        .setContentTitle(title)
                        .setContentText(body)
                        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                        .setAutoCancel(true)
                        .build();
        try {
//
            this.notificationManager.notify(1001, notification);

            JSObject result = new JSObject();
            result.put("success", true);

//            call.resolve(result);
            System.out.println(result);

        } catch (SecurityException e) {

            System.out.println(e);
//            call.reject("Notification permission not granted", e);
        }
    }

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }
}
